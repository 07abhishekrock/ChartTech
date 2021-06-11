class MyElement{
    constructor(query_string){
        this.DOMRef = document.querySelector(query_string); 
        this.isInputElement = this.DOMRef.tagName === 'INPUT';
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

    setTextValue = (string)=>{
        if(this.isInputElement) this.DOMRef.value = string;
        else this.DOMRef.innerText = string;
    }

    getValue = () => this.isInputElement ? this.DOMRef.value : this.DOMRef.innerText;

    checkInputValidity = ()=>{
        return this.DOMRef.checkValidity();
    }

    bindEvent = (handler_closure , event_name)=>{
        this.DOMRef.addEventListener(event_name , (e)=>{
            handler_closure()(e);
        });
    }

    synthetic_click = ()=>{
        this.DOMRef.click();
    }

}

class ElementGroup{
    constructor(elements){
        this.elements_array = elements;
        this.attributes = {};
    }
    addCommonAttribute(attribute_name , attribute_value){
        this.attributes[attribute_name] = attribute_value; 
    }
    getCommonAttribute(attribute_name){
        return this.attributes[attribute_name];
    }
    removeClassName = (class_string)=>{
        this.elements_array.forEach((element)=>{
            element.removeClass(class_string);
        })
    }
}

