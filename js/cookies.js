(function() {
      const banner = document.getElementById("cookie-banner");
      const okBtn = document.getElementById("cookie-ok");
      const txt = document.getElementById("txt");
      const policyVersion = 3; // Increment this if the policy changes
      if (!localStorage.getItem("cookieConsent") || localStorage.getItem("cookiePolicyVersion") < policyVersion) {
        setTimeout(() => banner.classList.add("show"), 500);
      }
      if (localStorage.getItem("cookiePolicyVersion") < policyVersion && localStorage.getItem("cookieConsent")) {
        txt.innerHTML = "We have updated our privacy policy. By continuing to use our site, you agree to the new policy.";
      }
      okBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "true");
        localStorage.setItem("cookiePolicyVersion", policyVersion);
        banner.classList.remove("show");
      });
    })();