const router = require("./authentication");
const Members = require('../models/members');
const bcrypt  = require('bcrypt');
const Subscriptions  = require('../models/subscriptions');
const Site = require('../models/wesite');

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

let x = {
  name:"test",
  title:"test",
  description:"test",
  keywords:"test",
  script:"",
  template_color: "",
  content_color:"",
  buttons_color: "",
  daily_msg_time: 0,
  rooms_msgs_likes: 0,
  wall_likes: 0,
  wall_upload_likes: 0,
  wall_upload_time: 0,
  allow_visitors: true,
  allow_reg: true,
  update_data_likes: 0,
  update_pic_likes: 0,
  notification_likes: 0,
  private_pic_likes: 0,
  public_letters: 250,
  private_letters: 250,
  wall_letters: 250,
  visitor_name_letters:5,
  reg_name_letters: 5
};

route.get('/test1',async(req,res)=>{
  let site = new Site(x);
  let m = await site.save();
  return res.send(m);
});

module.exports = route;