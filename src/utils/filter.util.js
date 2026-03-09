const buildFilter=(query,allowedFields=[])=>{
    const filter={};
    for(const key in query){
        if(allowedFields.includes(key)){
            filter[key]=query[key]
        }
    }
    return filter;
}

module.exports=buildFilter;