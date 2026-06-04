const now = new Date();
const img = document.querySelector('img.logo');
const url = window.location.href;
// First logo alternate depending on event
// For now, all we have is June, AKA Pride month
// Note to self: add more events here as needed - AKA when told to - and probably make this more efficient
// but for now, this is *fine*
if (now.getMonth() === 5 && img instanceof HTMLImageElement) {
    // Okay, it's June, so let's show the Pride logos instead
    // detect which part of the site we're on
    if (url.includes('/raindrippy/')) {
        // this means we're in the raindrippy subdirectory
        img.src = '/raindrippy/rd_pridevar.png';
    } else {
        // we're on the main site, so we can use the normal path
        img.src = '/main_pridevar.png';
    }
}

// PS if anyone is snooping around in this JS file, we aren't obligated to do this
// but we do it to show support for the cause(s) above
// also don't complain about it, we're not abandoning this practice :)