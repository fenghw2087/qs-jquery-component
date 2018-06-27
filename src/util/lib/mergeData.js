const mergeData = ( c,t ) => {
    for(const i in c){
        if(c.hasOwnProperty(i)){
            c[i] = t[i]
        }
    }
    return c;
};

export default mergeData