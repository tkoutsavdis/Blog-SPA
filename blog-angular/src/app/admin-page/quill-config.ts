import Quill from 'quill';

const SizeStyle: any = Quill.import('attributors/style/size');
SizeStyle.whitelist = [
  '10px', '12px', '14px', '16px', '18px', 
  '20px', '24px', '28px', '32px'
];

Quill.register(SizeStyle, true);

export const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }]
  ]
};