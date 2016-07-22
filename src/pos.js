'use strict';


    
    /*对条形码进行拆分*/
    function getBarcode(cartTags){
        return cartTags.map(function(tag){
            let info = tag.split("-");
            return{
                barcode:info[0],
                amount:parseFloat(info[1])||1
            }
        });
    }

    /*将同一系列物品合并*/
    function mergeBarcode(barcodes){
        let mergeBarcodes = [];
        for(let i = 0;i<barcodes.length;i++){
            let exist = mergeBarcodes.find(function(item){
                return (item.barcode===barcodes[i].barcode);
            });
            if(exist){
                exist.amount +=barcodes[i].amount;
            }else{
                mergeBarcodes.push(Object.assign({},barcodes[i]));
            }
        }
        return mergeBarcodes;
    }

    /*匹配获取购物车商品*/
    function getCartItems(mergeBarcodes){
        let cartItems = [];
        for(let i=0;i<mergeBarcodes.length;i++){
            let exist = shopItems.find(function(item){
                return (item.barcode === mergeBarcodes[i].barcode);
            });
            if(exist){
                cartItems.push(Object.assign({},exist,{amount:mergeBarcodes[i].amount}));
            }
        }
        return cartItems;
    }

    /*匹配购物车中打折的商品*/
    function matchDiscountItems(cartItems){
        let discountCartItems = [];
        for(let i=0;i<discountBarcodes.length;i++){
            for(let j = 0;j<cartItems.length;j++) {
                let exist = discountBarcodes[i].barcodes.find(function (item) {
                    return (cartItems[j].barcode === item);
                });
                if (exist) {
                    discountCartItems.push(Object.assign({}, cartItems[j], {type: discountBarcodes[i].type}));
                }else{
                    discountCartItems.push(Object.assign({},cartItems[j]));
                }
            }
        }
        return discountCartItems;
    }

    /*小计出打折商品价格*/
    function caculateDiscountSubtotal(discountCartItems) {
        return discountCartItems.map(function (item) {
            if(item.type&&item.amount>=2){
                return (Object.assign({},item,{discountSubtotal:(item.amount-1)*item.price}));
            }else{
                return (Object.assign({},item,{subtotal:item.amount*item.price}));
            }
        });
    }

    /*小计不打折的商品价格*/
    function caculateSubtotal(discountCartItemsPrices){
        return discountCartItemsPrices.map(function(item){
            if(item.type&&item.amount>=2) {
                return (Object.assign({}, item, {subtotal: item.amount * item.price}));
            }else{
                return(Object.assign({}, item));
            }
        });
    }

    /*计算总价*/
    function caculateToatl(discountCartItemsPrices){
        let total=0;
        for (let item of discountCartItemsPrices){
            if(item.type&&item.amount>=2){
                total += item.discountSubtotal;
            }else{
                total+=item.subtotal;
            }
        }
        return total;
    }

    /*计算打折后节省的钱*/
    function caculateSaveMoney(cartItemPrices) {
        let savedMoney = 0;
        for (let item of cartItemPrices){
            if(item.type&&item.amount>=2){
                savedMoney += item.subtotal-item.discountSubtotal;
            }
        }
        return savedMoney;
    }


    /*进行输出*/

    function printReceipt(){
        let shopItems = loadAllItems();
        let discountBarcodes = loadPromotions();
        let barcodes = getBarcode(cartTags);
        let mergeBarcodes =  mergeBarcode(barcodes);
        let cartItems = getCartItems(mergeBarcodes);
        let discountCartItems = matchDiscountItems(cartItems);
        let discountCartItemsPrices = caculateDiscountSubtotal(discountCartItems);
        let cartItemPrices = caculateSubtotal(discountCartItemsPrices);
        let total = caculateToatl(discountCartItemsPrices);
        let savedMoney = caculateSaveMoney(cartItemPrices);
        console.log(discountCartItemsPrices);
        console.log(total);
        console.log(savedMoney);
    }

    printReceipt();
