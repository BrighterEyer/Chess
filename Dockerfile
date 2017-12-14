FROM centos:centos7
MAINTAINER lanlonggu@foxmail.com

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install nodejs npm; yum clean all

# copy 程序代码到容器的/ 下
ADD . /src

RUN cd /src; npm install

EXPOSE 3500

CMD ["node", "/src/index.html"]
