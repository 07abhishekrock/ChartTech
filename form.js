class FormObject{
    constructor(submit_btn_query_string , form_children){
        this.form_children = form_children;
        this.form_submit_btn = document.querySelector(submit_btn_query_string);
    }
    formIsValid = ()=>{

        let no_error_flag = 1;
        for(let form_child of this.form_children){
            let [isValid , status_object] = form_child.returnValidityObject();

            if(!isValid){
                form_child.throwFieldError(status_object);
                no_error_flag = 0;
                break;
            }
            else{
                form_child.viewFooterError('',-1);
            }

        }

        if(no_error_flag){
            return true;
        }
        return false;

    }

    AddUserToServer = async ()=>{
        let user_object = {};
        this.form_children.forEach((form_child)=>{
            if(form_child.key) user_object[form_child.key] = form_child.field.getValue();
        })
        let response = await axios.post('http://localhost:3500/api/v1/user/signup',user_object).catch((e)=>console.error(e));
        return new Promise((resolve, reject)=>{
                resolve(response.data.status || 'failure');
        })
    }

    submitForm = async ()=>{
        if(this.formIsValid()){
            let payment_object = this.plans_element_object.getCommonAttribute('plan_selected');
            let new_order_created_response = await axios.post('http://localhost:3500/api/v1/createOrder',{
                amount:payment_object.amount,
                receiptID : payment_object.description + String(Math.ceil(Math.random() * 500))
            });
            if(new_order_created_response.data.error){
                alert('error in payment');
                return;
            }
            let new_order_id = new_order_created_response.data.id || '';

            payment_object.prefill = {};
            console.log(new_order_id);
            payment_object.order_id = new_order_id;

            for(let form_child of this.form_children){
                if(form_child.key && form_child.key !== 'password'){
                    payment_object.prefill[form_child.key] = form_child.field.getValue();
                }
            }

            payment_object["handler"] = (async (response)=>{
                console.log(response);
                let form_status = await this.AddUserToServer().catch((e)=>console.error(e));
                if(form_status === 'success'){
                    location.pathname = '/dashboard.html';
                }
            }).bind(this);

            let razor_pay_object = new RazorPaymentObject(payment_object);
            razor_pay_object.addFailureHandler(()=>{
                alert('payment failed , please try again');
            })
            razor_pay_object.openPaymentModal();

        }
    }

    init = (plans_element_object)=>{
        this.plans_element_object = plans_element_object;
        this.form_submit_btn.addEventListener('click',()=>{
            this.submitForm();
        })
        return this;
    }

}

class FieldWithErrorFunction{

    constructor(field_query_string , error_footer_label_string , error_callback_function , key){
        this.field = new MyElement(field_query_string).init(true);
        this.error_footer = new MyElement(error_footer_label_string).init();
        this.error_callback_fun = error_callback_function;
        this.key = key;
    }

    throwFieldError = (status_object)=>{
        let {error_index : error_index , error_string : error_string} = status_object;
        this.error_callback_fun();
        this.viewFooterError(error_string , error_index);
    }

    viewFooterError = (error_string , error_status)=>{

        this.error_footer.toDefault();

        switch(error_status){
            //invalid field error
            case -1 :
            this.error_footer.hide();
            break;

            case 0 : 
            this.error_footer.toDefault();
            this.error_footer.addClass('error');
            this.error_footer.setTextValue(error_string);
            break;

            case 1 : 
            this.error_footer.toDefault();
            this.error_footer.addClass('info');
            this.error_footer.setTextValue(error_string);
            break;
            
            default : 
            break;
        }
    }

}

class EmailInputElement extends FieldWithErrorFunction{
    constructor(field_query_string , error_footer_label_string , error_callback_fun , key){
        super(field_query_string , error_footer_label_string , error_callback_fun , key);
    }

    returnValidityObject = ()=>{
        //not implemented for non-input elements may do it if required in later versions.
        if(this.field.checkInputValidity()){
            return [true , {
                error_index : -1,
                error_string : 'no error found'
            }];
        }
        else{
            return [false , {
                error_index : 0,
                error_string : 'Invalid or Empty Email'
            }]
        }
    }
}

class PasswordInputElement extends FieldWithErrorFunction{
    constructor(field_query_string , error_footer_label_string , error_callback_fun , key){
        super(field_query_string , error_footer_label_string, error_callback_fun , key);
        this.length_constraint = 8;
    }
    returnValidityObject = ()=>{
    //not implemented for non-input elements
        if(this.field.checkInputValidity() && this.field.getValue().length >= this.length_constraint){
            return [true , {
                error_index : -1,
                error_string : 'no error found'
            }]
        }
        else{
            return [false, {
                error_index : 0,
                error_string : 'Password must be atleast 8 characters long.'
            }] 
        }
    }

    matches = (string_to_be_compared) => this.field.getValue() === string_to_be_compared;
}

class ConfirmPasswordElement extends FieldWithErrorFunction{
    constructor(field_query_string , error_footer_label_string , ReferencePasswordElement , error_callback_fun , key){
        super(field_query_string , error_footer_label_string , error_callback_fun , key);
        this.ReferencePasswordElement = ReferencePasswordElement;
    }
    returnValidityObject = ()=>{
        if(this.ReferencePasswordElement.matches(this.field.getValue())){
            return [true , {
                error_index : -1, 
                error_string : 'no error found'
            }]
        }
        else{
            return [false, {
                error_index : 0,
                error_string : 'Passwords do not match.'
            }]
        }
    }
}

class NonEmptyElement extends FieldWithErrorFunction{
    constructor(field_query_string , error_footer_label_string , error_callback_fun , key){
        super(field_query_string , error_footer_label_string , error_callback_fun , key);
    }
    returnValidityObject = ()=>{
        if(this.field.checkInputValidity()){
            return [true , {
                error_index : -1, 
                error_string : 'no error found'
            }]
        }
        else{
            return [false, {
                error_index : 0,
                error_string : 'Empty Field Value is not allowed.'
            }]
        }
    }
}

class RazorPaymentObject {
    constructor(options){
        this.razor_pay_object = new Razorpay(options);
    }
    addFailureHandler = (handler)=>{
        this.razor_pay_object.on('payment.failed',(response)=>{
            handler(response);
        })
    }
    openPaymentModal = ()=>{
        this.razor_pay_object.open();
    }
}
