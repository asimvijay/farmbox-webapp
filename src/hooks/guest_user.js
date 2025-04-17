// src/utils/guestUser.js
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

// Helper function to format Pakistani phone numbers
export const formatPakistaniNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+92${cleaned.substring(1)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('92')) {
    return `+${cleaned}`;
  }
  return phone;
};

// Login guest user
export const loginGuestUser = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Create guest user with OTP verification and profile setup
export const createGuestUser = async (router) => {
  try {
    let namePhone;
    let formattedPhone;
    let phoneValid = false;

    while (!phoneValid) {
      const result = await Swal.fire({
        title: 'Enter your details',
        html: `
          <div class="flex flex-col items-center">
            <input id="swal-input1" class="swal2-input mb-2 w-full" placeholder="Your Name" required>
            <div class="flex items-center w-full mb-2">
              <span class="mr-2 text-sm whitespace-nowrap">🇵🇰 +92</span>
              <input id="swal-input2" class="swal2-input flex-1" placeholder="3XX-XXXXXXX" type="tel" required>
            </div>
            <p class="text-xs text-gray-500 mt-2 text-center">
              Enter your 11-digit Pakistani number (without +92)
            </p>
          </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Submit',
        showCloseButton: true,
        preConfirm: () => {
          const name = document.getElementById('swal-input1').value.trim();
          const phone = document.getElementById('swal-input2').value.trim();

          if (!name || !phone) {
            Swal.showValidationMessage('Please fill out all fields');
            return false;
          }

          return { name, phone };
        },
        didOpen: () => {
          document.getElementById('swal-input1').focus();
        },
      });

      if (result.isDismissed && result.dismiss === Swal.DismissReason.close) {
        return null;
      }
      if (!result.value) return null;

      const cleaned = result.value.phone.replace(/\D/g, '');
      if (!/^[0-9]{10,11}$/.test(cleaned)) {
        const errorResult = await Swal.fire({
          title: 'Invalid Number',
          text: 'Please enter a valid 11-digit Pakistani number',
          icon: 'error',
          confirmButtonText: 'Try Again',
          showCloseButton: true,
        });
        if (errorResult.isDismissed && errorResult.dismiss === Swal.DismissReason.close) {
          return null;
        }
        continue;
      }

      formattedPhone = formatPakistaniNumber(result.value.phone);

      if (/^\+92[0-9]{10}$/.test(formattedPhone)) {
        namePhone = {
          name: result.value.name,
          phone: formattedPhone,
        };
        phoneValid = true;
      } else {
        const errorResult = await Swal.fire({
          title: 'Invalid Number',
          text: 'Please enter a valid Pakistani phone number (11 digits starting with 0)',
          icon: 'error',
          confirmButtonText: 'Try Again',
          showCloseButton: true,
        });
        if (errorResult.isDismissed && errorResult.dismiss === Swal.DismissReason.close) {
          return null;
        }
      }
    }

    // Check if the phone number is +923240251086
    if (namePhone.phone !== '+923240251086') {
      const featureResult = await Swal.fire({
        title: 'Feature Coming Soon',
        html: `
          <div class="text-center">
            <p class="text-lg text-gray-700 mb-4">
              This verification method will be available in future updates!
            </p>
            <p class="text-sm text-gray-500">
              Please continue to login with your existing account
            </p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Continue to Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        showCloseButton: true,
        focusConfirm: false,
      });
      if (featureResult.isDismissed && featureResult.dismiss === Swal.DismissReason.close) {
        return null;
      }
      if (featureResult.isConfirmed) {
        router.push('/login');
      }
      return null;
    }

    // Proceed with OTP verification
    const otpResponse = await fetch('/api/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(namePhone),
    });

    if (!otpResponse.ok) {
      const errorData = await otpResponse.json();
      throw new Error(errorData.message || 'Failed to send OTP');
    }

    let otpVerified = false;
    let otpAttempts = 0;
    let guestUser = null;
    let password = null;

    while (!otpVerified && otpAttempts < 3) {
      const otpResult = await Swal.fire({
        title: 'Verify OTP',
        html: `
          <p>We've sent an OTP to your WhatsApp number:</p>
          <p class="font-semibold">🇵🇰 ${namePhone.phone}</p>
          <input id="swal-input-otp" class="swal2-input mt-4" placeholder="Enter 6-digit OTP" required>
          ${
            otpAttempts > 0
              ? `<p class="text-red-500 text-sm mt-2">Incorrect OTP. ${
                  3 - otpAttempts
                } attempts remaining</p>`
              : ''
          }
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Resend OTP',
        confirmButtonText: 'Verify',
        showCloseButton: true,
        preConfirm: () => {
          return document.getElementById('swal-input-otp').value;
        },
        didOpen: () => {
          document.getElementById('swal-input-otp').focus();
        },
      });

      if (otpResult.isDismissed && otpResult.dismiss === Swal.DismissReason.close) {
        return null;
      }
      if (
        otpResult.isDismissed &&
        otpResult.dismiss === Swal.DismissReason.cancel
      ) {
        await fetch('/api/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(namePhone),
        });
        otpAttempts = 0;
        continue;
      }

      if (!otpResult.value) return null;

      otpAttempts++;

      const verifyResponse = await fetch('/api/guest/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: namePhone.phone,
          otp: otpResult.value,
          name: namePhone.name,
        }),
      });

      if (verifyResponse.ok) {
        const verified = await verifyResponse.json();
        guestUser = verified.user;
        password = verified.password;
        if (!guestUser?.id || !guestUser?.phone) {
          throw new Error('Guest user data missing id or phone');
        }
        otpVerified = true;
      } else if (otpAttempts >= 3) {
        throw new Error('Too many incorrect OTP attempts');
      }
    }

    if (!otpVerified) return null;

    const addressResult = await Swal.fire({
      title: 'Delivery Information',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Delivery Address" required>' +
        '<input id="swal-input2" class="swal2-input" placeholder="City" required>' +
        '<input id="swal-input3" class="swal2-input" placeholder="Postal Code" required>' +
        '<input id="swal-input4" class="swal2-input" placeholder="Area (Optional)">' +
        '<input id="swal-input5" class="swal2-input" placeholder="Country" value="Pakistan" required>',
      focusConfirm: false,
      showCloseButton: true,
      preConfirm: () => {
        return {
          address: document.getElementById('swal-input1').value,
          city: document.getElementById('swal-input2').value,
          postalCode: document.getElementById('swal-input3').value,
          area: document.getElementById('swal-input4').value || null,
          country: document.getElementById('swal-input5').value,
        };
      },
      didOpen: () => {
        document.getElementById('swal-input1').focus();
      },
    });

    if (addressResult.isDismissed && addressResult.dismiss === Swal.DismissReason.close) {
      return null;
    }
    if (!addressResult.value) return null;

    const addressInfo = addressResult.value;
    const updatePayload = {
      guestId: guestUser.id,
      phone: guestUser.phone || namePhone.phone,
      address: addressInfo.address,
      city: addressInfo.city,
      postalCode: addressInfo.postalCode,
      country: addressInfo.country,
      area: addressInfo.area,
    };

    const updateResponse = await fetch('/api/guest/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      const updateErrorResult = await Swal.fire({
        title: 'Error',
        text: errorData.message || 'Failed to update guest information',
        icon: 'error',
        confirmButtonText: 'Try Again',
        showCloseButton: true,
      });
      if (updateErrorResult.isDismissed && updateErrorResult.dismiss === Swal.DismissReason.close) {
        return null;
      }
      throw new Error(errorData.message || 'Failed to update guest info');
    }

    const { user: updatedGuest } = await updateResponse.json();

    try {
      const whatsappPayload = {
        phone: guestUser.phone || namePhone.phone,
        email: guestUser.email,
        password: password,
      };
      const whatsappResponse = await fetch('/api/guest/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whatsappPayload),
      });

      if (!whatsapp_Response.ok) {
        console.error(
          'Failed to send WhatsApp message:',
          await whatsappResponse.json()
        );
      }
    } catch (whatsappError) {
      console.error('WhatsApp error:', whatsappError);
    }

    const successResult = await Swal.fire({
      title: 'Profile Created!',
      html: `
        <div class="text-left">
          <p>Your guest profile has been created successfully!</p>
          <p class="mt-4"><strong>Email:</strong> ${guestUser.email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <div class="bg-green-50 p-3 rounded mt-4">
            <p class="text-sm text-green-700">
              <span class="font-semibold">🇵🇰 WhatsApp confirmation sent to ${
                guestUser.phone || namePhone.phone
              }</span>
            </p>
            <p class="text-xs text-green-600 mt-1">
              Please save these credentials to track your orders later.
            </p>
          </div>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Continue Shopping',
      showCloseButton: true,
    });

    if (successResult.isDismissed && successResult.dismiss === Swal.DismissReason.close) {
      return null;
    }

    try {
      const loggedInUser = await loginGuestUser(guestUser.email, password);
      router.push('/');
      return loggedInUser;
    } catch (loginError) {
      console.error('Auto-login failed:', loginError);
      return guestUser;
    }
  } catch (error) {
    console.error('Guest creation error:', error);
    const errorResult = await Swal.fire({
      title: 'Error',
      html: `
        <p>${error.message || 'Failed to create guest profile'}</p>
        <p class="text-sm text-gray-500 mt-2">Please try again with a valid Pakistani number</p>
      `,
      icon: 'error',
      showCloseButton: true,
    });
    if (errorResult.isDismissed && errorResult.dismiss === Swal.DismissReason.close) {
      return null;
    }
    return null;
  }
};

// Add item to cart
export const addToCart = async (user, box, quantities, frequencies, router) => {
  let currentUser = user;

  if (!currentUser) {
    const result = await Swal.fire({
      title: 'Not Logged In',
      text: 'You need to login to add items to cart. Do you want to login or continue as guest?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Continue as Guest',
      reverseButtons: true,
      showCloseButton: true,
    });

    if (result.isConfirmed) {
      router.push('/login');
      return;
    } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
      currentUser = await createGuestUser(router);
      if (!currentUser) {
        return;
      }
    } else {
      return; // Stop if popup is closed or dismissed without selecting an option
    }
  }

  try {
    const response = await fetch('/api/auth/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUser.id,
        boxId: box.id,
        quantity: quantities[box.id] || 1,
        frequency: frequencies[box.id] || box.deliveryfrequency,
        price: box.price,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to cart');
    }

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Added to cart!',
      showConfirmButton: false,
      timer: 1500,
    });

    // Optionally redirect to cart page
    // router.push('/cart');
  } catch (error) {
    console.error('Add to cart error:', error);
    Swal.fire('Error', error.message || 'Failed to add item to cart', 'error');
  }
};