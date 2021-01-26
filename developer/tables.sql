create table users
(
    id         bigint auto_increment
        primary key,
    login      varchar(50)  default 'unavailable'     not null,
    name       varchar(150) default 'unavailable'     not null,
    created_at timestamp    default CURRENT_TIMESTAMP null,
    updated_at timestamp    default CURRENT_TIMESTAMP null,
    constraint users_login_uindex
        unique (login)
);

create table commits
(
    id             bigint auto_increment,
    `cursor`       varchar(50)                         not null,
    committed_date timestamp                           null,
    additions      int                                 null,
    deletions      int                                 null,
    user_id        bigint                              null,
    created_at     timestamp default CURRENT_TIMESTAMP null,
    updated_at     timestamp default CURRENT_TIMESTAMP null,
    constraint commit_id_uindex
        unique (id),
    constraint commits_cursor_uindex
        unique (`cursor`),
    constraint commit_user_id_fk
        foreign key (user_id) references users (id)
);

alter table commits
    add primary key (id);

