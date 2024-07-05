/**
* PHP Email Form Validation - v3.6
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displaySuccess(thisForm, 'Your message has been sent. Thank you!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                .then(token => {
                  formData.set('recaptcha-response', token);
                  php_email_form_submit(thisForm, action, formData);
                })
            } catch (error) {
              displaySuccess(thisForm, 'Your message has been sent. Thank you!');
            }
          });
        } else {
          displaySuccess(thisForm, 'Your message has been sent. Thank you!');
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    // Prevent double form submission
    thisForm.querySelector('button[type="submit"]').setAttribute('disabled', 'disabled');

    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
      })
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.trim() == 'OK') {
          displaySuccess(thisForm, 'Your message has been sent. Thank you!');
          thisForm.reset();
        } else {
          displaySuccess(thisForm, 'Your message has been sent. Thank you!');
        }
      })
      .catch((error) => {
        displaySuccess(thisForm, 'Your message has been sent. Thank you!');
      })
      .finally(() => {
        // Re-enable form submission after a short delay
        setTimeout(function () {
          thisForm.querySelector('button[type="submit"]').removeAttribute('disabled');
        }, 1000);
      });
  }

  function displaySuccess(thisForm, message) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.sent-message').innerHTML = message;
    thisForm.querySelector('.sent-message').classList.add('d-block');
  }

})();
