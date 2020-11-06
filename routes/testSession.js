const router = require("./authentication");
const Members = require('../models/members');
const bcrypt  = require('bcrypt');
const Subscriptions  = require('../models/subscriptions');

const route = require('express').Router();

route.post('/test',(req,res)=>{
  req.session.name = req.body.name;
  return res.send('saved');
});

const DeviceDetector =   require('node-device-detector');
const   detector     =   new DeviceDetector;

let a = [
  "حذف الحائط",
  "التنبيهات",
  "تغير النك",
  "تغير النكات",
  "الباند",
  "فتح الخاص",
  "نقل من الغرفة",
  "إداره الغرف",
  'انشاء الغرف',
  'إداره العضويات',
  'إسكات العضو',
  'تعديل لايكات العضو',
  'الفلتر',
  'الاشتراكات',
  'الاختصارات',
  'رسائل الدردشة',
  'دارة البوتات',
  'تعديل الصلاحيات',
  'كشف النكات',
  'لوحه التحكم',
  'المحادثات الجماعية',
  'حذف صورة العضو',
  'مخفي',
  'إداره الموقع'
]

route.get('/test1',async(req,res)=>{
  let sub = await Subscriptions.findOne({name: 'test'});

  let salt = await bcrypt.genSalt(10);
  let hashedPass = await bcrypt.hash('11223344',salt);

  let mem = new Members({name: 'mera' , decoration: 'mera', password: hashedPass , reg_date: new Date() , sub: sub._id , expire_date: new Date()});
  let r = await mem.save()
  return res.send(r);
});

module.exports = route;