export function copyText(t: string) {
    try {
        navigator.clipboard.writeText(t);
    } catch {
        const el = document.createElement("textarea");
        el.value = t;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        el.select();
        el.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }
}

/** @param data - base64 image data */
export function downloadImage(data: string) {
    const a = document.createElement("a"); //Create <a>
    a.href = "data:image/png;base64," + data; //Image Base64 Goes here
    a.download = "qr.png"; //File name Here
    a.style.position = "absolute";
    a.style.left = "-9999px";
    a.click(); //Download file
}
