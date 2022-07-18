import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  constructor() { }

  addToCart(theCartItem: CartItem){
    
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length > 0){
    // find the item in the cart based on item id
      for( let tempCartItem of this.cartItems){
        if (tempCartItem.id == theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }
      // will refact the about for loop and use Array.find()   ../ I don't use the below becuse of Quantity 
      //existingCartItem != this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id) 
      
    


    // check if we foun it 
    alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  
  computeCartTotals() {
    let totoalPriceValue: number =0;
    let totoalQuantityValue: number =0;

    for(let currentCartItems of this.cartItems){
      totoalPriceValue += currentCartItems.quantity * currentCartItems.unitPrice;
      totoalQuantityValue += currentCartItems.quantity;
    }

    // publish the new values ... all subscribers will recive the new data
    this.totalPrice.next(totoalPriceValue);
    this.totalQuantity.next(totoalQuantityValue);

    // log cart data just for debugging purpose
    this.logCartData(totoalPriceValue, totoalQuantityValue);
  }
  logCartData(totoalPriceValue: number, totoalQuantityValue: number) {
    console.log('Contents of the cart')
    for (let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totoalPriceValue.toFixed(2)}, totalQuantity: ${totoalQuantityValue}`);
    console.log('-----');
  }


  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity --;

    if (theCartItem.quantity === 0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    // if found, remove the item from the array at the given index
    if( itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
