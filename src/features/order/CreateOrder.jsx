import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: 'Vegetale',
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: 'Spinach and Mushroom',
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const username = useSelector((state) => state.user.username);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const dispatch = useDispatch();

  const formErrors = useActionData(); // This component (CreateOrder) is linked with Action so we can access its data here to display phone error

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;
  // const cart = fakeCart;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <button onClick={() => dispatch(fetchAddress())}>Get Position</button>

      {/* Both way are correct , we are sending post request to create new item */}
      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        {/* This form is from react-router*/}
        <div className="mb-5 flex  flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40 ">First Name</label>
          {/* input is in index.css */}
          <input
            className="input grow"
            type="text"
            name="customer"
            defaultValue={username}
            required
          />
        </div>
        <div className="mb-5 flex  flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40 ">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className=" mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>
        <div className="mb-5 flex  flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40 ">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              className="input w-full"
              required
            />
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>
        <div>
          {/* NOTE: This to get Cart data in FORM that will be later goes to acion function on submit*/}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />{' '}
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting
              ? 'Placing order...'
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// when ever the above from will submit (on this path /order/new) this action will be called
export async function action({ request }) {
  const formData = await request.formData(); // these 2 lines taking data from above FORM
  const data = Object.fromEntries(formData);

  const order = {
    // creating a new order object
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  // error handling for wrong phone number
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give your correct phone number. We might need it to contact you.';
  if (Object.keys(errors).length > 0) return errors;

  // if everything okay, create new order and redirect
  const newOrder = await createOrder(order); // For POST method we send data here

  //Do not over use it
  // In this we are directly eccesing the redux store because dispatch hook do not work in functions.
  store.dispatch(clearCart()); // clear cart before ordering

  return redirect(`/order/${newOrder.id}`); // then we redirect to this URL  where we can see data ( id of new order). Redirect is same as Nvaigation that we used in worldwise but that is a hook , that will not work in function
}

export default CreateOrder;
