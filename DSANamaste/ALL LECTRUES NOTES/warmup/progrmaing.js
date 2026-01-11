// // let obj ={
// //     name:"akakka",
// //     bool:true,
// //     arr:[1,2,2,2,54,2,1,281,5]
// // }

// // console.log(obj.arr[1]);

// // function sum(a,b){
// //     return a+b;
// //     console.log(a,b);   
// // }

// // function abc(){
// //     console.log('okokok');
    
// // }
// // function checkAge(age) {
// //   if (age >= 18) {
// //     return "Allowed";
// //   }
// //   return "Not Allowed";
// // }

// // // so when abc exctures is there no any return stament
// // // but it will return undefined
// // // Multiple returns? Yes — but only ONE runs


// // console.log(sum(1,2));

// function test() {
//   for (let i = 1; i <= 5; i++) {
//     if (i === 2) continue;
//     if (i === 4) break;
//     console.log(i);
//   }
// }


// import express from express;

// const app=express()

// When JavaScript compares:

// undefined < arr[i]


// it always evaluates to false, so count never updates.

function searchtheproblem(arr,x){
for(let i=0;i<arr.length;i++){
  if(arr[i]==x){
    return i;
  }
  return -1;
}}

let arr =[2,3,4,6,4,6,5,56,35,4,54,54,56];
function findlargest(arr){
  let count=0;
  for(let i=0;i<arr.length;i++){
    if(count<arr[i]){
      count=arr[i];
    }
  }
  return count;
}
// console.log(findlargest(arr));

function secondlargest(arr){
  let first= -Infinity;
  let second= -Infinity;
  for(let i=0;i<arr.length;i++){
      if(arr[i]>first){
        second=first;
        first=arr[i];
      }
      else if(arr[i]>second){
        second=arr[i];
      }
      
  }
   return second;
}
// console.log(secondlargest(arr));

// let n=4;
// for(let i=0;i<n;i++){
//   let row =" "
//   for(let j=0;j<n;j++){
//     row+=' *'
// }
// console.log(row);
// }

// let n=4;
// for(let i=0;i<n;i++){
//   let row =" "
//   for(let j=0;j<=i;j++){
//     row+=' *'
// }
// console.log(row);
// }




let n=5;
for(let i=0;i<n;i++){
  let row =" "
  for(let j=0;j<=i;j++){
    row+=i+1
}
console.log(row);
}