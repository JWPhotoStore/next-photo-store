'use client';

import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import styles from '@/styles/Nav.module.css';
import Link from 'next/link';
import { RiShoppingCartLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { setCheckout } from '../store/cartSlice';
import { setPaymentIntent } from '../store/stripeSlice';
import { useState, useEffect } from 'react';
import { openMobileMenu } from '../store/uiSlice';
import { useWindowSize } from '@/util/hooks';
import {
  useGetActiveOrderQuery,
  useAddCartItemsLSMutation,
} from '../store/apiSlice';
import { RxHamburgerMenu } from 'react-icons/rx';
import {
  getCartItemsTotalQuantityLS,
  sumItemsAndQuantity,
  getCartItemsLS,
  clearLocalStorage,
} from '@/util/cart-item-utils';

declare global {
  interface WindowEventMap {
    cartItemLocalStorage: CustomEvent;
  }
}

export default function Nav({ user }: Session) {
  const { data, isFetching, isSuccess, isError, error } =
    useGetActiveOrderQuery();
  const dispatch = useDispatch();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [addCartItems] = useAddCartItemsLSMutation();

  useEffect(() => {
    // handles guest users only
    if (user) return;
    const totalQuantityLS = getCartItemsTotalQuantityLS();
    setTotalQuantity(totalQuantityLS);

    const renderCartItemsLSLength = () => {
      const totalQuantity = getCartItemsTotalQuantityLS();
      setTotalQuantity(totalQuantity);
    };
    window.addEventListener('cartItemLocalStorage', renderCartItemsLSLength);

    return () =>
      window.removeEventListener(
        'cartItemLocalStorage',
        renderCartItemsLSLength
      );
  }, []);

  useEffect(() => {
    if (!user) return;
    if (isSuccess) {
      const cartItemsLS = getCartItemsLS();

      // Add the LS cart items to Database and then clear the local storage
      if (cartItemsLS.length !== 0) {
        try {
          addCartItems({ cartItemsLS });
          clearLocalStorage();
        } catch (err) {
          if (err) console.error(err);
        }
      }

      if (data.cartItems) {
        setTotalQuantity(sumItemsAndQuantity(data.cartItems));
      } else {
        setTotalQuantity(0);
      }

      if (data.paymentIntentId) {
        dispatch(setPaymentIntent(data.paymentIntentId));
      }
    }

    if (isError) {
      console.error(error);
    }
  }, [isFetching, isSuccess, isError, data, user]);

  const { width } = useWindowSize();
  const mobileBreakpoint = 640;

  return (
    <nav>
      <ul className={styles.navContentLeft}>
        {/* TODO: create new route for photos */}
        <Link href="/">prints</Link>
        <Link href="/contact">contact</Link>
      </ul>
      <Link href="/" onClick={() => dispatch(setCheckout('cart'))}>
        <h1>Kushi photos</h1>
      </Link>
      <ul className={styles.navContentRight}>
        {width && width >= mobileBreakpoint && !user && (
          <li className={styles.authAction} onClick={() => signIn()}>
            <span>Sign in</span>
          </li>
        )}
        {user && (
          <Link href="/api/auth/signout">
            <li className={styles.authAction}>
              hello <span>{user.name}</span>
            </li>
          </Link>
        )}
        <Link href="/cart" onClick={() => dispatch(setCheckout('cart'))}>
          <li className={styles.cartIcon}>
            <RiShoppingCartLine size={24} />
            <span>{totalQuantity === 0 ? '' : totalQuantity}</span>
          </li>
        </Link>
        {width && width < mobileBreakpoint && (
          <div
            className={styles.mobileMenuIcon}
            onClick={() => dispatch(openMobileMenu())}
          >
            <RxHamburgerMenu size={25} />
          </div>
        )}
      </ul>
    </nav>
  );
}
