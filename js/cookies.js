(function() {
      const banner = document.getElementById("cookie-banner");
      const okBtn = document.getElementById("cookie-ok");
      const txt = document.getElementById("txt");
      const policyVersion = 3; // Increment this if the policy changes
      if (!banner || !okBtn) return; // page has no banner - nothing to do

      // getItem returns a string or null, so compare numbers explicitly.
      // The old `null < 3` / `"2" < 3` string comparison worked by accident.
      const storedVersion = Number(localStorage.getItem("cookiePolicyVersion") || 0);
      const consented = localStorage.getItem("cookieConsent");

      if (!consented || storedVersion < policyVersion) {
        setTimeout(() => banner.classList.add("show"), 500);
      }
      if (consented && storedVersion < policyVersion && txt) {
        txt.textContent = "We have updated our privacy policy. By continuing to use our site, you agree to the new policy.";
      }
      okBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "true");
        localStorage.setItem("cookiePolicyVersion", policyVersion);
        banner.classList.remove("show");
      });
    })();
