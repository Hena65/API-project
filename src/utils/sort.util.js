const sortBuilder=(query)=>{
    const sort={};

    if(query.sortBy){
        const field=query.sortBy;
        const order=query.order==="desc"?-1:1

        sort[field]=order
    }
    else{
        sort.createdAt=-1
    }
    return sort
}

module.exports=sortBuilder

