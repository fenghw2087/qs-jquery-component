const isEmptyObj = (obj) => {
    for(const i in obj){
        if(obj.hasOwnProperty(i)){
            return false;
        }
    }
    return true;
};

export default isEmptyObj