let arr= [-5, -3, 2, 4 , 6] ;
let arr3=[]

let j = arr.length;
for (i; i < arr.length; i++, j--){
    if((abs(arr[i]) >  abs(arr[j]) && (i < j)){
    arr3.unshift(arr[i]);
    arr3.unshift(arr[j]);
} else {
    arr3.unshift(arr[j]);
    arr3.unshift(arr[i]);

    }
}

console.log(arr3);