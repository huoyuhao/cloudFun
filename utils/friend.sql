CREATE TABLE `friend_user` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `openid` varchar(30) DEFAULT NULL COMMENT 'Openid',
  `name` varchar(20) DEFAULT NULL COMMENT '用户昵称',
  `user_img` varchar(100) DEFAULT NULL COMMENT '用户头像',
  `sex` varchar(1) DEFAULT NULL COMMENT '性别',
  `birth_date` varchar(12) DEFAULT NULL COMMENT '出生年月日',
  `height` varchar(20) DEFAULT NULL COMMENT '身高',
  `qualification` varchar(20) DEFAULT NULL COMMENT '学历',
  `career` varchar(20) DEFAULT NULL COMMENT '职业',
  `location` varchar(20) DEFAULT NULL COMMENT '现居地',
  `residence_place` varchar(20) DEFAULT NULL COMMENT '户籍地',
  `annual_income` varchar(20) DEFAULT NULL COMMENT '年收入',
  `home_car` varchar(20) DEFAULT NULL COMMENT '房车情况',
  `weixin` varchar(20) DEFAULT NULL COMMENT '微信号',
  `desc` varchar(300) DEFAULT NULL COMMENT '个人描述',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

CREATE TABLE `friend_Browse` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `openid` varchar(30) DEFAULT NULL COMMENT 'Openid',
  `user_id` varchar(20) DEFAULT NULL COMMENT '用户id',
  `operate_user_id` varchar(20) DEFAULT NULL COMMENT '被操作用户id',
  `operate_type` varchar(20) DEFAULT NULL COMMENT '操作类型',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

