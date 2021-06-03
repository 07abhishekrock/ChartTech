class MyElement{
    constructor(query_string){
        this.DOMRef = document.querySelector(query_string); 
    }

    changeStyle(styles){
        for(let Style in styles){
            this.DOMRef.style[Style] = styles[Style];
        }
    }

    toDefault = ()=>{
        this.DOMRef.style = "";
    }

    hide = ()=>{
        this.toDefault();
        this.changeStyle({
            "opacity":0,
            "pointer-events":'none'
        })
    }

    dontRender = ()=>{
        this.toDefault();
        this.changeStyle({
            "display":'none'
        })
    }

    init = (view_state = false)=>{
        if(!view_state){
            this.hide();
        }
        return this;
    }

    translate = (x='0px',y='0px',z='0px')=>{
        this.changeStyle({
            'transform':`translate3d(${x},${y},${z})`
        })
    }

    removeClass = (class_string)=>{
        this.DOMRef.classList.remove(class_string);
    }

    addClass = (class_string)=>{
        this.DOMRef.classList.add(class_string);
    }

}

class ElementGroup{
    constructor(elements){
        this.elements_array = elements;
    }
    removeClassName = (class_string)=>{
        this.elements_array.forEach((element)=>{
            element.removeClass(class_string);
        })
    }
}

let modal_wrapper_ref = new MyElement('div.modal-wrapper').init();
let login_ref = new MyElement('div.modal-wrapper>div.login.modal-inner').init();
let signup_ref = new MyElement('div.modal-wrapper>div.signup.modal-inner').init();

let signup_page_group = new MyElement('div.signup.modal-inner div.forms').init(true);
let planSingle = new MyElement('div.plans>div.plan:first-child').init(true);
let planTeam = new MyElement('div.plans>div.plan:last-child').init(true);

let groupPlans = new ElementGroup([
    planSingle , planTeam
]);

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
            break;
        case 'team' : 
            planTeam.addClass('selected');
            break;
        default :
            break;
    }
}