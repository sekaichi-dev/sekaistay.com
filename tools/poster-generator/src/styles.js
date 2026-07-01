export function baseCss() {
  return `
    :root{
      --white:#FFFFFF; --cloud:#F7F8FA; --black:#000000; --charcoal:#2D2D2D;
      --deep-teal:#167B81; --teal:#259DA3; --bright-teal:#54BEC3; --teal-tint:#E5F4F5;
      --mid-gray:#9AA0A6; --light-gray:#DADCE0;
    }
    *{ box-sizing:border-box; margin:0; padding:0; }
    html,body{
      font-family:"Noto Sans JP","Helvetica Neue",Arial,sans-serif;
      color:var(--charcoal); background:var(--white);
      -webkit-print-color-adjust:exact; print-color-adjust:exact;
    }
    .en{ font-family:"Helvetica Neue",Arial,sans-serif; color:var(--mid-gray); }
    h1,h2,h3{ font-weight:700; }
  `;
}
