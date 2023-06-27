const keywords = /m=1|xnxx|janda|xxx|xx|sex|seks|porn|naked|telanjang/gi;
const redirectTo = 'https://www.google.com/';

let m;
while ((m = keywords.exec(document.location.href)) !== null) {
    if (m.index === keywords.lastIndex) {
        keywords.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
        window.location.replace(redirectTo);
    });
}
