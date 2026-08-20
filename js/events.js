const now = new Date();
const logos = document.querySelectorAll('img.logo');
const url = window.location.href;
// First logo alternate depending on event
// For now, all we have is June, AKA Pride month
// Note to self: add more events here as needed - AKA when told to - and probably make this more efficient
// but for now, this is *fine*
if (now.getMonth() === 5 && logos.length) {
    // Okay, it's June, so let's show the Pride logos instead
    // detect which part of the site we're on
    // (querySelectorAll, not querySelector: the landing page hero has a second
    //  logo mark alongside the topbar one, and both should swap)
    const src = url.includes('/raindrippy/') || url.includes('/status/')
        // this means we're in the raindrippy subdirectory (or the status pages,
        // which are RainDrippy-branded too)
        ? '/raindrippy/rd_pridevar.png'
        // we're on the main site, so we can use the normal path
        : '/main_pridevar.png';
    logos.forEach(img => { img.src = src; });
}

// PS if anyone is snooping around in this JS file, we aren't obligated to do this
// but we do it to show support for the cause(s) above
// also don't complain about it, we're not abandoning this practice :)
