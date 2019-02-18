#!/usr/bin/env bash

# MyWxappUnpacker 项目路径
WXAPPUNPACKER_PATH=/shared/my_git/python/MyWxappUnpacker

UNWEAPP_PATH=/shared/git_code/unweapp/unweapp

FILE_FORMAT=wxapkg

unweapp()
{
unweapp_dir=$1
 if [ -z "$1" ]
    then
 unweapp_dir=`pwd`
 fi
echo "${unweapp_dir}"
echo "find  ${unweapp_dir} -name "*.${FILE_FORMAT}" -exec java -jar ${UNWEAPP_PATH}/dest/unweapp-0.1.jar {} \;"
find  ${unweapp_dir} -name "*.${FILE_FORMAT}" -exec java -jar ${UNWEAPP_PATH}/dest/unweapp-0.1.jar {} \;
return 0;
}

wxappUnpacker_pkg()
{
fname=$1
echo "node ${WXAPPUNPACKER_PATH}/wuWxapkg.js ${fname}"
node ${WXAPPUNPACKER_PATH}/wuWxapkg.js ${fname}
return 0;
}

wxappUnpacker()
{
de_dir=$1
    if [ -z "$1" ]
    then
 de_dir=`pwd`
    fi
echo "${de_dir}"
echo "for fname in `find ${de_dir} -name "*.${FILE_FORMAT}"`"
for fname in `find ${de_dir} -name "*.${FILE_FORMAT}"`
do
wxappUnpacker_pkg ${fname}
done
return 0;
}

de_miniapp()
{
    if [ "--unweapp" == "$1" ] || [ "-1" == "$1" ]
     then
unweapp $2 $3
    elif [ "--wxappUnpacker" == "$1" ] || [ "-2" == "$1" ]
     then
wxappUnpacker $2 $3
    elif [ "-d" == "$1" ]
     then
wxappUnpacker_pkg $2 $3
  else
  wxappUnpacker $1 $2
    fi
return 0;
}

de_miniapp $1 $2 $3


