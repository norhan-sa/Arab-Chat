const mongoose    =   require('mongoose');
const { Schema }  =   mongoose;

const site_schema = new Schema({
  id: {
    type: Number,
    default: 1
  },        
  name:{
    type: String,       
  },
  title: {
    type: String       
  },
  description: {
    type: String       
  },
  keywords:{
    type: String 
  },
  script: {
    type: String       
  },
  template_color: {
    type: String,
  },
  content_color: {
    type: String
  },
  buttons_color: {
    type: String
  },
  daily_msg_time: {
    type: Number
  },
  rooms_msgs_likes: {
    type: Number
  },
  wall_likes: {
    type: Number
  },  
  wall_upload_likes: {
    type: Number
  }, 
  wall_upload_time: {
    type: Number        
  },
  allow_visitors: {
    type: Boolean        
  },
  allow_reg: {
    type: Boolean        
  },
  update_data_likes: {
    type: Number        
  },
  update_pic_likes: {
    type: Number 
  },  
  notification_likes: {
    type: Number        
  },
  private_pic_likes: {
    type: Number        
  },
  public_letters: {
    type: Number        
  },
  private_letters: {
    type: Number        
  },
  wall_letters: {
    type: Number        
  },
  visitor_name_letters: {
    type: Number        
  },
  reg_name_letters: {
    type: Number        
  }   
});

const Site = mongoose.model('Site', site_schema);

module.exports = Site;