

CREATE TABLE `marry_user` (
  `id` INT(4) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '来宾姓名',
  `tel` varchar(20) DEFAULT NULL COMMENT '来宾电话',
  `num` INT(4) DEFAULT NULL COMMENT '来宾人数',
  `desc` varchar(200) DEFAULT NULL COMMENT '来宾祝福',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='来宾表';
