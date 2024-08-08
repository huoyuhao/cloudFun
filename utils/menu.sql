CREATE TABLE `menu` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '菜单名称',
  `condiment` varchar(100) DEFAULT NULL COMMENT '调料',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜单表';

CREATE TABLE `menu_tag` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `menu_id` INT(4) DEFAULT NULL COMMENT '菜单ID',
  `content` varchar(100) DEFAULT NULL COMMENT 'Tag名称',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜单标签表';


CREATE TABLE `menu_step` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `menu_id` INT(4) DEFAULT NULL COMMENT '菜单ID',
  `content` varchar(500) DEFAULT NULL COMMENT '步骤内容',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜单步骤表';



CREATE TABLE `menu_image` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `menu_id` INT(4) DEFAULT NULL COMMENT '菜单ID',
  `content` varchar(300) DEFAULT NULL COMMENT '图片链接',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜单图片表';



CREATE TABLE `menu_material` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `menu_id` INT(4) DEFAULT NULL COMMENT '菜单ID',
  `content` varchar(300) DEFAULT NULL COMMENT '菜单原料',
  `number` varchar(10) DEFAULT NULL COMMENT '菜单原料数量',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜单原料表';