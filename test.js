function convert(i){
    if (i.toString().length==1){
        return(`0${i}`)
    }
    else{return i}
}

console.log(convert(8));


