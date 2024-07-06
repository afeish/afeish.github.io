---
layout: single
title: "How to add customized AGGREGATE for postgresql"
date: 2024-03-22 20:48:54 +0800
categories: tool
tags: db, postgresql
collection: 2024
classes: wide

toc: true
toc_label: "Content Outline"
toc_icon: "cog"
toc_sticky: true

---



# 如何使用自定义的 AGGREGATE 去解决array的聚合

## 问题

我们使用 `peewee` 去准备我们的基础数据，如下：

```python
from peewee import *
from playhouse.postgres_ext import *
import datetime

db = PostgresqlDatabase('postgres', user='postgres.bsdxodcilisingudbizp', password='T40Aob5Ma4hbYCtr', host='aws-0-us-west-1.pooler.supabase.com', port=6543)

import logging
logger = logging.getLogger('peewee')
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.DEBUG)

class BaseModel(Model):
    class Meta:
        database = db

class User(BaseModel):
    username = TextField()

class Tweet(BaseModel):
    content = TextField()
    code = ArrayField(CharField, null=True)
    cat = CharField(null=True)
    timestamp = DateTimeField(default=datetime.datetime.now)
    user = ForeignKeyField(User, backref='tweets')

class Favorite(BaseModel):
    user = ForeignKeyField(User, backref='favorites')
    tweet = ForeignKeyField(Tweet, backref='favorites')

db.drop_tables([User, Tweet, Favorite])
# db.execute_sql('drop AGGREGATE if EXISTS array_concat_agg(anycompatiblearray);')

def populate_test_data():
    db.create_tables([User, Tweet, Favorite])
    db.execute_sql('CREATE or replace AGGREGATE array_concat_agg(anycompatiblearray) (   SFUNC = array_cat,   STYPE = anycompatiblearray );')
    data = (
        ('huey', ('meow', 'hiss', 'purr'), ('1001','1002'), 'cat1'),
        ('mickey', ('woof', 'whine'), ('1003'), 'cat2'),
        ('zaizee', ('hello', 'greet'), ('1005','1006', '1007'), 'cat1')
    )
    for username, tweets, code, cat in data:
        user = User.create(username=username)
        for tweet in tweets:
            print(f"Tweet = {tweet}, code = {code}")
            Tweet.create(user=user, content=tweet, code=code, cat=cat)

    # Populate a few favorites for our users, such that:
    favorite_data = (
        ('huey', ['whine']),
        ('mickey', ['purr']),
        ('zaizee', ['meow', 'purr']))
    for username, favorites in favorite_data:
        user = User.get(User.username == username)
        for content in favorites:
            tweet = Tweet.get(Tweet.content == content)
            Favorite.create(user=user, tweet=tweet)

populate_test_data() # 导出测试数据
```

当我们希望按照类别将 tweet 的内容进行整合时，因为 Tweet 的 code 字段为 ArrayField， 我们使用PG 自带的 `array_agg` 执行聚合：

```python
[t for t in Tweet.select(SQL('array_agg(distinct code) as code')).group_by(Tweet.cat).dicts()]
```

会报错，如下：

```shell
ArraySubscriptError                       Traceback (most recent call last)
File e:\anaconda3\envs\demo-env\Lib\site-packages\peewee.py:3311, in Database.execute_sql(self, sql, params, commit)
   3310     cursor = self.cursor()
-> 3311     cursor.execute(sql, params or ())
   3312 return cursor

ArraySubscriptError: cannot accumulate arrays of different dimensionality


During handling of the above exception, another exception occurred:

DataError                                 Traceback (most recent call last)
Cell In[11], line 1
----> 1 [t for t in Tweet.select(SQL('array_agg(distinct code) as code')).group_by(Tweet.cat).dicts()]

File e:\anaconda3\envs\demo-env\Lib\site-packages\peewee.py:7260, in BaseModelSelect.__iter__(self)
   7258 def __iter__(self):
   7259     if not self._cursor_wrapper:
-> 7260         self.execute()
   7261     return iter(self._cursor_wrapper)

File e:\anaconda3\envs\demo-env\Lib\site-packages\peewee.py:2025, in database_required.<locals>.inner(self, database, *args, **kwargs)
   2022 if not database:
   2023     raise InterfaceError('Query must be bound to a database in order '
...
-> 3311     cursor.execute(sql, params or ())
   3312 return cursor

DataError: cannot accumulate arrays of different dimensionality
```

## 解决方案

### 1. 自定义 AGGREGATE

```sql
CREATE or replace AGGREGATE array_concat_agg(anycompatiblearray) (   SFUNC = array_cat,   STYPE = anycompatiblearray );
```

此时，采用自定义的 AGGREGATE 执行时，得到的结果正常

```python
[t for t in Tweet.select(SQL('array_concat_agg(distinct code) as code')).group_by(Tweet.cat).dicts()]
```


## 补充 notebook

