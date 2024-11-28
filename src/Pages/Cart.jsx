import { Fragment, useState } from "react";
import Swal from "sweetalert";
import Header from "../Components/Header";
import productData from "../Data/products";
import "../Styles/Cart.css";

export default function Cart() {
    const [cart, setCart] = useState([]);

    function increment(id) {
        setCart((currentCondition) => {
            const index = currentCondition.findIndex((item) => item.id === id);
            const updated = [...currentCondition]
            if (index !== -1) {
                updated[index] = { ...updated[index], quantity: updated[index].quantity + 1 }
                return updated;
            }
            else {
                return currentCondition;
            }
        });
    }

    function decrement(id) {
        setCart((currentCondition) => {
            const index = currentCondition.findIndex((item) => item.id === id);
            const updated = [...currentCondition]
            const changeQuantity = updated[index].quantity - 1;
            if (index !== -1) {
                if (changeQuantity > 0) {
                    updated[index] = { ...updated[index], quantity: changeQuantity }
                    return updated;
                }
                else {
                    return currentCondition.filter((item) => item.id !== id);
                }
            }
            else {
                return currentCondition;
            }
        });
    }

    function addToCart(selected) {
        setCart((currentCondition) => {
            const isExist = currentCondition.find((item) => item.id === selected.id);
            if (isExist) {
                return currentCondition.map((item) => item.id === selected.id ? 
                    { ...item, quantity: item.quantity + 1 } : item
                );
            }
            else {
                return [...currentCondition, { ...selected, quantity: 1 }]
            }
        });
    }

    function removeItem(selected) {
        const removed = cart.filter((c) => c !== selected );
        setCart([...removed]);
    }

    function clearAllItem() {
        if (cart.length === 0) {
            Swal("", "kamu belum menambahkan satu item pun ke keranjang", "warning");
        }
        else {
            Swal("", "keranjang dikosongkan", "success");
            setCart([]);
        }
    }

    function checkOut() {
        if (cart.length > 0) {
            Swal("", "terima kasih sudah berbelanja. semoga harimu menyenangkan 😊", "success");
            setCart([]);
        }
        else {
            Swal("", "tambahkan satu atau beberapa produk dahulu", "warning");
        }
    }

    const totalItem = cart?.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart?.reduce((total, item) => total + item.quantity * item.price, 0);

    return (
        <Fragment>
            <Header number={1}/>
            <div className="shopping-cart">
                <div className="cart-wrap">
                    <div className="detail-info">
                        <div>total item : {totalItem}</div>
                        <div>total price : ${totalPrice.toFixed(2)}</div>
                        <div className="btn-group">
                            <button type="button" onClick={checkOut}>Check Out</button>
                            <button type="button" onClick={clearAllItem}>Remove All</button>
                        </div>
                    </div>
                    <div className="cart-content">
                        {cart.length > 0 ? 
                            cart.map((c, index) => (
                                <div className="selected-card" key={`selected-product-${index}`}>
                                    <div>{c.title}</div>
                                    <div className="image-wrap">
                                        <img src={c.images[0]} alt={c.title}/>
                                    </div>
                                    <div>Price : ${c.price}</div>
                                    <div>Total item : {c.quantity}</div>
                                    <div>Total Price : ${(c.quantity * c.price).toFixed(2)}</div>
                                    <div className="btn-group">
                                        <button type="button" onClick={() => increment(c.id)}>+</button>
                                        <button type="button" onClick={() => decrement(c.id)}>-</button>
                                        <button type="button" onClick={() => removeItem(c)}>Remove</button>
                                    </div>
                                </div>
                            )) : <div>keranjangmu masih kosong</div>
                        }
                    </div>
                </div>
                <div className="product-content">
                    {productData.map((product, index) => (
                        <div className="product-card" key={`good-product-${index}`}>
                            <div>{product.title}</div>
                            <div className="image-wrap">
                                <img src={product.images[0]} alt={product.title}/>
                            </div>
                            <div>${product.price}</div>
                            <div className="btn-group">
                                <button type="button" onClick={() => addToCart(product)}>Add to Cart</button>
                                <button type="button">Buy</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    )
}
