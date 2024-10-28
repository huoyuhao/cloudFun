CREATE TABLE `menu` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '菜单名称',
  `condiment` varchar(100) DEFAULT NULL COMMENT '调料',
  `tag` varchar(200) DEFAULT NULL COMMENT '分类',
  `material` varchar(200) DEFAULT NULL COMMENT '材料',
  `step` varchar(2000) DEFAULT NULL COMMENT '步骤',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜单表';

CREATE TABLE `menu_image` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `menu_id` INT(4) DEFAULT NULL COMMENT '菜单ID',
  `content` varchar(300) DEFAULT NULL COMMENT '图片链接',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜单图片表';


CREATE TABLE `user` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `openid` INT(4) DEFAULT NULL COMMENT 'Openid',
  `name` varchar(20) DEFAULT NULL COMMENT '用户昵称',
  `user_img` varchar(100) DEFAULT NULL COMMENT '用户头像',
  `sex` TINYINT(1) DEFAULT NULL COMMENT '性别',
  `iphone` INT(20) DEFAULT NULL COMMENT '电话',
  `bind_openid` varchar(20) DEFAULT NULL COMMENT '绑定用户openid',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';
