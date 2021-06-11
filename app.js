let modal_wrapper_ref = new MyElement('div.modal-wrapper').init();
let login_ref = new MyElement('div.modal-wrapper>div.login.modal-inner').init();
let signup_ref = new MyElement('div.modal-wrapper>div.signup.modal-inner').init();

let signup_page_group = new MyElement('div.signup.modal-inner div.forms').init(true);
let planSingle = new MyElement('div.plans>div.plan:first-child').init(true);
let planTeam = new MyElement('div.plans>div.plan:last-child').init(true);

let groupPlans = new ElementGroup([
    planSingle , planTeam
]);

let planSingleObject = {

    "key": "rzp_test_CknipYtCownoGC", // Enter the Key ID generated from the Dashboard
    "amount": "500000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Acme Corp",
    "description": "Single Plan",
    "image": "https://example.com/your_logo",
    "order_id": "order_HLLc3rBuuhQaK5", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
        console.log(response);
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }

}
let planTeamObject = {

    "key": "rzp_test_CknipYtCownoGC", // Enter the Key ID generated from the Dashboard
    "amount": "500000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Acme Corp",
    "description": "Team Plan",
    "image": "https://example.com/your_logo",
    "order_id": "order_HLLcYk8buT7sso", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
        console.log(response);
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }

}

groupPlans.addCommonAttribute('plan_selected',planSingleObject)

openLogin = ()=>{
    modal_wrapper_ref.toDefault();
    login_ref.toDefault();
    signup_ref.dontRender();
}    

closeModal = ()=>{
    modal_wrapper_ref.hide();
    login_ref.dontRender();
    signup_ref.dontRender();
}

openSignUp = ()=>{
    modal_wrapper_ref.toDefault();
    signup_ref.toDefault();
    login_ref.dontRender();
}

moveToPageIndex = (target_index)=>{
    signup_page_group.translate(`${-1 * target_index * 100}%`);
}

setSelectedState = (type_string)=>{
    groupPlans.removeClassName('selected');
    switch(type_string){
        case 'single' : 
            planSingle.addClass('selected');
            groupPlans.addCommonAttribute('plan_selected',planSingleObject);
            break;
        case 'team' : 
            planTeam.addClass('selected');
            groupPlans.addCommonAttribute('plan_selected',planTeamObject);
            break;
        default :
            break;
    }
}


//login and signup form
let next_btn_signup = new MyElement('div.form#signup-stage-1>a.center-btn').init(true);
let back_btn_signup = new MyElement('div.signup span.header-text>i.back-button').init();
let password_signup_field = new PasswordInputElement('#signup-password>input','#signup-password>i' , ()=>back_btn_signup.synthetic_click , 'password');
let signup_form = new FormObject('div.form#signup-stage-2>a.center-btn', 
[
    new EmailInputElement('#signup-email>input','#signup-email>i' , back_btn_signup.synthetic_click , 'email'),
    password_signup_field,
    new ConfirmPasswordElement('#signup-confirm-password>input','#signup-confirm-password>i' , password_signup_field, back_btn_signup.synthetic_click),
    new NonEmptyElement('#signup-username>input','#signup-username>i',()=>next_btn_signup.synthetic_click , 'userName')
]
).init(groupPlans);

next_btn_signup.bindEvent(()=>{
    return ()=>{
        moveToPageIndex(1);
        back_btn_signup.toDefault();
    }
} , 'click')

back_btn_signup.bindEvent(()=>{
    return ()=>{
        moveToPageIndex(0);
        back_btn_signup.hide();
    }
} , 'click')

