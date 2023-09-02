const { sendOrderConfirmationEmail } = require('../utils/mailer');

const confirmOrder = async (orderDetails) => {
  try {
    // Gather order details
    const { orderId, userEmail, orderItems, totalAmount } = orderDetails;

    // Send order confirmation email
    await sendOrderConfirmationEmail(userEmail, orderId, orderItems, totalAmount);

    return { message: 'Order confirmation email sent successfully.' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  confirmOrder,
};
