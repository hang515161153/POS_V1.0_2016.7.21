'use strict';
let tags = [
    "ITEM000003-2",
    "ITEM000003-2.5",
    "ITEM000000",
    "ITEM000001",
    "ITEM000001",
    "ITEM000001"
];
describe("getBarcode",function(){
    it("put one to two",function () {

        let result = getBarcode(tags);
        let expected = [{barcode:'ITEM000003',amount:2},{barcode:'ITEM000003',amount:2.5},{barcode:'ITEM000000',amount:1},{barcode:'ITEM000001',amount:1},{barcode:'ITEM000001',amount:1},{barcode:'ITEM000001',amount:1}];
        expect(result).toEqual(expected);
    });
});
//let barcodes = getBarcode(tags);
describe("mergeBarcode",function(){
    it("Merge the same Items",function () {

        let result = mergeBarcode(getBarcode(tags));
        let expected = [{barcode:'ITEM000003',amount:4.5},{barcode:'ITEM000000',amount:1},{barcode:'ITEM000001',amount:3}];
        expect(result).toEqual(expected);
    });
});

describe("getCartItems",function(){
    it("Get the Items of Cart",function () {

        let result = getCartItems(mergeBarcode(getBarcode(tags)));
        let expected = [
            {
                barcode:'ITEM000003',
                name:"荔枝",
                amount:4.5,
                unit: '斤',
                price: 15.00
            },
            {
                barcode:'ITEM000000',
                name:"可口可乐",
                amount:1,
                unit: '瓶',
                price: 3.00
            },
            {
                barcode:'ITEM000001',
                name:"雪碧",
                amount:3,
                unit: '瓶',
                price: 3.00
            }];
        expect(result).toEqual(expected);
    });
});
describe("matchDiscountItems",function(){
    it("Get the discountItems of Cart",function () {

        let result = matchDiscountItems(getCartItems(mergeBarcode(getBarcode(tags))));
        let expected = [
            {
                barcode:'ITEM000003',
                name:"荔枝",
                amount:4.5,
                unit: '斤',
                price: 15.00
            },
            {
                type:'BUY_TWO_GET_ONE_FREE',
                barcode:'ITEM000000',
                name:"可口可乐",
                amount:1,
                unit: '瓶',
                price: 3.00
            },
            {
                type:'BUY_TWO_GET_ONE_FREE',
                barcode:'ITEM000001',
                name:"雪碧",
                amount:3,
                unit: '瓶',
                price: 3.00
            }];
        expect(result).toEqual(expected);
    });
});
describe("caculateDiscountSubtotal",function(){
    it("Caculate the Money from discountItems",function () {

        let result = caculateDiscountSubtotal(matchDiscountItems(getCartItems(mergeBarcode(getBarcode(tags)))));
        let expected = [
            {
                barcode:'ITEM000003',
                name:"荔枝",
                amount:4.5,
                unit: '斤',
                price: 15.00,
                subtotal:67.5
            },
            {
                type:'BUY_TWO_GET_ONE_FREE',
                barcode:'ITEM000000',
                name:"可口可乐",
                amount:1,
                unit: '瓶',
                price: 3.00,
                subtotal:3.00
            },
            {
                type:'BUY_TWO_GET_ONE_FREE',
                barcode:'ITEM000001',
                name:"雪碧",
                amount:3,
                unit: '瓶',
                price: 3.00,
                discountSubtotal:6.00
            }];
        expect(result).toEqual(expected);
    });
});
describe("caculateSubtotal",function(){
    it("Caculate the Money from EveryItems",function () {

        let result = caculateSubtotal(caculateDiscountSubtotal(matchDiscountItems(getCartItems(mergeBarcode(getBarcode(tags))))));
        let expected = [
            {
                barcode:'ITEM000003',
                name:"荔枝",
                amount:4.5,
                unit: '斤',
                price: 15.00,
                subtotal:67.5
            },
            {
                type:'BUY_TWO_GET_ONE_FREE',
                barcode:'ITEM000000',
                name:"可口可乐",
                amount:1,
                unit: '瓶',
                price: 3.00,
                subtotal:3.00
            },
            {
                type:'BUY_TWO_GET_ONE_FREE',
                barcode:'ITEM000001',
                name:"雪碧",
                amount:3,
                unit: '瓶',
                price: 3.00,
                discountSubtotal:6.00,
                subtotal:9.00
            }];
        expect(result).toEqual(expected);
    });
});
describe("caculateToatl",function(){
    it("Caculate the Money from AllItems",function () {

        let result = caculateToatl(caculateDiscountSubtotal(matchDiscountItems(getCartItems(mergeBarcode(getBarcode(tags))))));
        let expected = 76.5;
        expect(result).toEqual(expected);
    });
});
describe("caculateSaveMoney",function(){
    it("Caculate the Saved Money",function () {

        let result = caculateSaveMoney(caculateSubtotal(caculateDiscountSubtotal(matchDiscountItems(getCartItems(mergeBarcode(getBarcode(tags)))))));
        let expected = 3.00;
        expect(result).toEqual(expected);
    });
});