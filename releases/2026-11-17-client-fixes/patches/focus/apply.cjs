const fs=require('fs');const input=process.argv[2],output=process.argv[3];if(!input||!output)throw Error('usage: input output');let s=fs.readFileSync(input,'utf8');const patches=[
["dialog.dataset.ohanaCategory=id;dialog.setAttribute('aria-labelledby','ohana-category-title');", "dialog.dataset.ohanaCategory=id;dialog.tabIndex=-1;dialog.setAttribute('aria-label',category.name);"],
["document.body.append(dialog);dialog.show();dialog.querySelector('h2').tabIndex=-1;dialog.querySelector('h2').focus();}","document.body.append(dialog);dialog.show();dialog.focus({preventScroll:true});}"]
];for(const[a,b]of patches){if(s.split(a).length!==2)throw Error('anchor count mismatch');s=s.replace(a,b);}fs.writeFileSync(output,s);
