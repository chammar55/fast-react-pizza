import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData(); // This component (CreateOrder) is linked with Action so we can access its data here to display phone error

  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      {/* Both way are correct , we are sending post request to create new item */}
      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        {/* This form is from react-router*/}
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>
        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p>{formErrors.phone}</p>}
        </div>
        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>
        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>
        <div>
          {/* NOTE: This to get fakeCart data in FORM that will be later goes to acion function on submit*/}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />{" "}
          <button disabled={isSubmitting}>
            {isSubmitting ? "Placing order..." : "Order now"}
          </button>
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
    priority: data.priority === "on",
  };

  // error handling for wrong phone number
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give your correct phone number. We might need it to contact you.";
  if (Object.keys(errors).length > 0) return errors;

  // if everything okay, create new order and redirect
  const newOrder = await createOrder(order); // For POST method we send data here
  return redirect(`/order/${newOrder.id}`); // then we redirect to this URL  where we can see data ( id of new order). Redirect is same as Nvaigation that we used in worldwise but that is a hook , that will not work in function
}

export default CreateOrder;
