'use strict';
(function(){

    angular.module('myApp.services')
        .service('Customer', serviceFoo)
        .service('$checkBeforClose', checkBeforClose);
    serviceFoo.$inject=['$resource','$modal','$q'];
    function serviceFoo($resource,$uibModal,$q){
        var Items= $resource('/api/custom/:_id',{_id:'@_id'});
        return {
            getList:getList,
            getItem:getItem,
            query:Items.query,
            get:Items.get,
            save:Items.save,
            delete:Items.delete,
            create:create,
        }
        function getList(paginate,query){
            if(!paginate){
                paginate={page:0}
            }
            var data ={perPage:paginate.rows ,page:paginate.page,query:query};
            if(global.get('crawler') && global.get('crawler').val){
                data.subDomain=global.get('store').val.subDomain;
            }
            return Items.query(data).$promise
                .then(getListComplete)
            //.catch(getListFailed);
            function getListComplete(response) {
                if(paginate.page==0){
                    if(response && response.length){
                        paginate.items=response.shift().index;
                    }else{
                        paginate.items=0;
                    }
                }
                return response;
            }

            function getListFailed(error) {
                console.log('XHR Failed for getNews.' + error);
                return $q.reject(error);
            }
        }
        function getItem(id){
            return Items.get({_id:id} ).$promise
                .then(getItemComplete)
            //.catch(getItemFailed);
            function getItemComplete(response) {
                return response;
            }
            function getItemFailed(error) {
                return $q.reject(error);
            }
        }
        function create(){
            return $q(function(resolve,reject){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/CONTENT/master/createCustomer.html',
                    controller: function($uibModalInstance){
                        var self=this;
                        self.name=''
                        self.ok=function(){
                            $uibModalInstance.close(self.name);
                        }
                        self.cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    },
                    controllerAs:'$ctrl',
                });
                modalInstance.result.then(function (name) {
                    if(name){
                        resolve(name.substring(0,50))
                    }else{
                        reject()
                    }

                }, function (err) {
                    reject(err)
                });
            })

        }
    };

  checkBeforClose.$inject=['$http','$q','$timeout','$resource','$uibModal'];
  function checkBeforClose($http,$q,$timeout,$resource,$uibModal){
      this.getWarehouseDetail=
          function (materials,currency) {
              return $q(function(resolve,reject){
                  var modalInstance = $uibModal.open({
                      animation: true,
                      size:'lg',
                      windowClass:'modal-check',
                      templateUrl: '/components/customer/warehouseDetail.html',
                      controller: function($uibModalInstance,$rootScope,$resource,exception,$q,$http,materials,currency){
                          console.log(materials,currency);
                          var self=this;
                          self.currency=currency;
                          self.start=0;
                          self.end=0;
                          self.materials=materials.filter(function (m) {
                              return m.currency==currency && (m.deltaPlus || m.deltaMinus);
                          });
                          var s=0,e=0,dp=0,dm=0;
                          self.materials.forEach(function (m) {
                              s+=m.start;
                              e+=m.end;
                              dp+=m.deltaPlus;
                              dm+=m.deltaMinus;
                          });
                          self.start=s;
                          self.deltaPlus=dp;
                          self.deltaMinus=dm;
                          self.end=e;

                      },
                      controllerAs:'$ctrl',
                      resolve:{
                          materials:function () {
                              return materials;
                          },
                          currency:function () {
                              return currency;
                          },
                      }
                  });
              });
          };
      this.getPn=
          function (el,start,end) {
              return $q(function(resolve,reject){
                  var modalInstance = $uibModal.open({
                      animation: true,
                      size:'lg',
                      windowClass:'modal-check',
                      templateUrl: '/components/customer/getPn.html',
                      controller: function($uibModalInstance,$rootScope,$resource,exception,$q,$http,el,start,end){
                          console.log(el)
                          var self=this;
                          self.item=el;
                          var sku=(el.sku)?el.sku:el.code;
                          self.item.trueSku=sku;
                          var url = 'http://46.101.131.133:7700/api/collections/Material?page=0&perPage=5&store=5a3cc10e1626aa0566f7ea87&query=';
                          var urlPn = 'http://46.101.131.133:7700/api/collections/Pn?page=0&perPage=100&store=5a3cc10e1626aa0566f7ea87&populate=materials.item&query=';
                          var q={sku:sku};
                          var urlL = url+JSON.stringify(q);
                            $q.when()
                                .then(function () {
                                    return $http.get(urlL);
                                })
                                .then(function (res) {
                                    //console.log(res)
                                    if(res.data && res.data.length){
                                        res.data.shift();
                                        //console.log(res.data);
                                        var _id = res.data[0]._id;
                                        var dateStart = new Date(start);
                                        dateStart.setHours(0,0,0,0);
                                        dateStart.setDate(dateStart.getDate() - 30);


                                        var dateEnd = new Date(end);
                                        dateEnd.setHours(23,59,59,999);
                                        self.startDate=moment(dateStart).format('LLL');
                                        self.endDate=moment(dateEnd).format('LLL');
                                        var query={'materials.item':_id,date:{$gte:dateStart.getTime(),$lt:dateEnd.getTime()}};
                                        var urlPnL=urlPn+JSON.stringify(query);
                                        return $http.get(urlPnL);

                                    }
                                })
                                .then(function (res) {
                                    console.log(res);
                                    if(res.data && res.data.length){
                                        res.data.shift();
                                        console.log(res.data);
                                        res.data.forEach(function (pn) {
                                            pn.materials=pn.materials.filter(function (m) {
                                                //console.log(sku,m.item.sku)
                                                return m.item.sku==sku;
                                            });
                                            pn.date=moment(pn.date).format('LLL');
                                            if(pn.currencyData && pn.currencyData['EUR']){
                                                pn.price = Math.round((el.incomePrice/pn.currencyData['EUR'][0])*100)/100;
                                            };
                                        });
                                        self.pns=res.data;
                                    };
                                });

                      },
                      controllerAs:'$ctrl',
                      resolve:{
                          el:function () {
                              return el;
                          },
                          start:function () {
                              return start;
                          },
                          end:function () {
                              return end;
                          }
                      }
                  });
              });
          };
      this.getDetailZakaz=
          function (id) {
              return $q(function(resolve,reject){
                  var modalInstance = $uibModal.open({
                      animation: true,
                      size:'lg',
                      windowClass:'modal-check',
                      templateUrl: '/components/customer/getDetailZakaz.html',
                      controller: function($uibModalInstance,$resource,exception,$q,$http,id){
                          var self=this;
                          self.currencyArr=['UAH','USD','EUR'];
                          self.item={};
                          self.sumsW={};
                          self.sumsM={};
                          self.totalSums={};
                          self.currencyArr.forEach(function (c) {
                              self.sumsW[c]=0;
                              self.sumsM[c]=0;
                              self.totalSums[c]=0;
                          })
                          var url = 'http://46.101.131.133:7700/api/collections/Zakaz/'+id+'?store=5a3cc10e1626aa0566f7ea87';
                          $q.when()
                              .then(function () {
                                  return $http.get(url);
                              })
                              .then(function (res) {
                                 var data=res.data;
                                  data.date= new Date(data.date);
                                  if(data.rns && data.rns.length){
                                      data.materials = data.rns.reduce(function (materials,rn) {
                                          //console.log(rn)
                                          if(rn && rn.materials && rn.materials.length){
                                              rn.materials.forEach(function (m) {

                                                  m.linkData={
                                                      name:rn.name+ " ("+((rn.actived)?'проведена':'не проведена')+")",
                                                      uisref:'frame.Rn.item',
                                                      id:rn._id
                                                  }
                                                  m.item.sku2 = (m.item.sku2 && m.item.sku2.length)?m.item.sku2[0]:''
                                                  self.sumsM[rn.currency]+=m.sum;
                                                  self.sumsM[rn.currency]=Math.round(self.sumsM[rn.currency]*100)/100
                                                  //m.sum=(m.sum).toFixed(2)
                                                  m.currency=rn.currency;
                                                  materials.push(m);

                                              });
                                          }
                                          return materials;
                                      },[]);
                                  }
                                  self.totalSumWork=0;
                                  if(data.acts && data.acts.length){
                                      data.works = data.acts.reduce(function (works,act) {
                                          if(act && act.works && act.works.length){
                                              act.works.forEach(function (m) {
                                                  console.log(m.item)
                                                  m.linkData={
                                                      name:act.name+ " ("+((act.actived)?'проведена':'не проведена')+")",
                                                      uisref:'frame.Act.item',
                                                      id:act._id
                                                  }
                                                  self.sumsW[act.currency]+=m.price;
                                                  self.sumsW[act.currency]=Math.round(self.sumsW[act.currency]*100)/100
                                                  m.currency=act.currency
                                                  m.price=(m.price).toFixed(2)
                                                  works.push(m)
                                              })
                                          }
                                          return works;
                                      },[])
                                  }
                                  /*data.materials=data.materials.map(function (m) {
                                   if(m.item && m.item.sku2 && m.item.sku2.length){m.item.sku2=m.item.sku2[0]}else{m.item={};m.item.sku2=''}
                                   return m
                                   })*/
                                  if(!data.typeOfContrAgent){
                                      data.typeOfContrAgent='Supplier'
                                  }
                                  self.item=data;
                                  self.currencyArr.forEach(function (c) {
                                      self.totalSums[c]=self.sumsW[c]+self.sumsM[c];
                                  })
                                 console.log(self.item)
                              })
                              .catch(function (err) {
                                  console.log(err)
                                 if(err){
                                     exception.catcher('получение данных',err);
                                 }
                              });
                      },
                      controllerAs:'$ctrl',
                      resolve:{
                          id:function () {
                              return id;
                          },
                      }
                  });
              });
          };
      this.showWokerJobs=
          function (jobs,start,end) {
              return $q(function(resolve,reject){
                  var modalInstance = $uibModal.open({
                      animation: true,
                      size:'lg',
                      windowClass:'modal-check',
                      templateUrl: '/components/customer/showWokerJobs.html',
                      controller: function($uibModalInstance,jobs,start,end){
                          var self=this;
                          self.jobs=jobs;
                          var dateStart = new Date(start);
                          dateStart.setHours(0,0,0,0);
                          var dateEnd = new Date(end);
                          dateEnd.setHours(23,59,59,999);
                          self.startDate=moment(dateStart).format('LLL');
                          self.endDate=moment(dateEnd).format('LLL');
                      },
                      controllerAs:'$ctrl',
                      resolve:{
                          jobs:function () {
                              return jobs;
                          },
                          start:function () {
                              return start;
                          },
                          end:function () {
                              return end;
                          }
                      }
                  });
              });
          };
    this.doCheck=
      function (data,suppliers,producers,workers){
        return $q(function(resolve,reject){
          var modalInstance = $uibModal.open({
            animation: true,
            size:'lg',
            windowClass:'modal-check',
            templateUrl: '/components/customer/checkBeforClose.html',
            controller: function($uibModalInstance,$rootScope,$resource,exception,$http,data,suppliers,producers,workers){
              var self=this;
              var url = 'http://46.101.131.133:7700/api/collections/Material?page=0&perPage=5&store=5a3cc10e1626aa0566f7ea87&query=';

              self.changeProducer=changeProducer;
              self.changeName=changeName;
              self.changeSupplier=changeSupplier;
              self.changeMaterial=changeMaterial;
              self.getHref=getHref;
              self.reCheckMaterial=reCheckMaterial;
              self.producers=producers;
              self.suppliers=suppliers;
              self.workers=workers;

              function getHref (spark) {
                  var s = "http://www.autofan.kharkov.ua/bookkeep/material?name="+spark.name+'&currency=EUR';
                  if(spark.sku){
                      s+='&sku='+spark.sku;
                      if(spark.code){
                          s+='&sku2='+spark.code;
                      }
                  }else{
                      s+='&sku='+spark.code;
                  }
                  if(spark.producer){
                      s+='&producer='+spark.producer;
                  }
                  return s;
              }

              var Jobticket = $resource('api/jobticket/:id',{id:'@_id'});


              data.sparks.forEach(function(s){
                for(var i=0;i<suppliers.length;i++){
                  if(suppliers[i]._id===s.supplier){
                    s.supplierName=suppliers[i].name;
                    break;
                  }
                };
                for(var i=0;i<producers.length;i++){
                  if(producers[i]._id===s.producer){
                    s.producerName=producers[i].name;
                    break;
                  }
                };
                handleSpark(s);
              });

              self.item = data;

              function handleSpark(s,showInfo) {
                  var q = {};
                return $q.when()
                  .then(function () {


                    if(s.sku){
                      q.sku=s.sku;
                    }else if(s.code){
                      q.sku=s.code;
                    }else{
                      return null;
                    }
                    //console.log(q);
                    var urlL = url+JSON.stringify(q);
                    //console.log(url)
                      if(s.rn){return}
                    return $http.get(urlL);
                  })
                  .then(function (res) {
                      if(s.rn){
                          s.isInWarehouse=true;
                          return;
                      }
                      s.result='проверяется';
                      s.isInWarehouse=false;
                      s.create=false;
                      delete s.materials;
                      delete s.notInStock;
                      if(res && res.data && res.data.length){
                          res.data.shift();
                          s.materials=[];
                          for(var i =0;i<res.data.length;i++){
                              console.log('res.data[i]',res.data[i]);
                              if(res.data[i].data && res.data[i].data.length){
                                  for(var j =0;j<res.data[i].data.length;j++){
                                      console.log(res.data[i].data[j]);
                                      var o={
                                          name:res.data[i].name,
                                          producer:res.data[i].producer.name,
                                          currency:res.data[i].currency,
                                          supplier:res.data[i].data[j].supplier.name,
                                          price:res.data[i].data[j].price,
                                          priceForSale:res.data[i].data[j].priceForSale,
                                          qty:res.data[i].data[j].qty,
                                          sku : res.data[i].sku,
                                          code :(res.data[i].sku2 && res.data[i].sku2[0])?res.data[i].sku2[0]:'',
                                      };
                                      s.materials.push(o);
                                  }
                              }

                          }
                          if(s.materials.length){
                              s.result='выберите из списка';
                          }else{
                              s.notInStock=true;
                              s.result='на складе нет прихода';
                          }

                          for(var i=0;i<s.materials.length;i++){
                              if(s.name==s.materials[i].name && s.producer==s.materials[i].producer && s.supplier==s.materials[i].supplier){
                                  if(s.q>s.materials[i].qty){
                                      s.result='на складе не достаточное количество ('+s.materials[i].qty+')';
                                  }else{
                                      s.result='все ок';
                                      s.incomePrice=s.materials[i].price;
                                      s.isInWarehouse=true;
                                  }
                              }
                          }
                      }else{
                          s.result='запчасти с таким кодом  на складе не существует';
                          s.create=true;
                      }
                      if(showInfo){
                          exception.showToaster('info','проверка запчасти '+ q.sku+' произведена');
                      }

                      return;
                    //console.log(res);
                    if(res.data && res.data.length){
                      res.data.shift();
                        for(var i =0;i<res.data.length;i++){
                          if(res.data[i].name===s.name){
                              s.fromAccount = res.data[i];
                              break;
                          }
                      }
                      if(!s.fromAccount){
                          s.result='у запчасти с таким кодом  на складе другое название';
                          s.changeName=true;
                          s.names = res.data;
                      } else if(s.producer!==s.fromAccount.producer._id){
                        s.result='у запчасти с таким кодом  на складе другой производитель - '+s.fromAccount.producer.name;
                        s.changeProducer=true;
                      }else {
                          if(s.fromAccount.data && s.fromAccount.data.length){
                              s.suppliers=[];
                              for(var i=0;i<s.fromAccount.data.length;i++){
                                  if(s.fromAccount.data[i].supplier._id===s.supplier){
                                      s.suppliers=null;
                                        if(s.q>s.fromAccount.data[i].qty){
                                          s.result='на складе не достаточное количество ('+s.fromAccount.data[i].qty+')';
                                        }else{
                                          s.result='все ок';
                                          s.isInWarehouse=true;
                                        }
                                        break;
                                  }
                                  s.suppliers.push(s.fromAccount.data[i].supplier._id);
                              }
                              if(s.suppliers && s.suppliers.length){
                                  s.result='на складе запчасти от других поставщиков';
                                  s.changeSupplier=true;
                                  s.suppliers = suppliers.filter(function (sup) {
                                      return s.suppliers.indexOf(sup._id)>-1;
                                  });
                                  console.log(s.suppliers);
                              }else{
                                  delete s.suppliers;
                              }
                          }else{
                            s.result='на складе есть название, но нет наличия';
                          }
                      }

                      //console.log(s);
                      //console.log(s.fromAccount);

                    }else{
                      s.result='запчасти с таким кодом  на складе не существует';
                    }
                  })
                    .catch(function (err) {
                        s.result='проверяется';
                        s.isInWarehouse=false;
                        s.create=false;
                        delete s.materials;
                        console.log(err)
                        if(err){
                            exception.catcher('проверка запчасти',err);
                        }

                    });
              }
              function changeMaterial(idx,material) {
                  delete data.sparks[idx].materials;
                  data.sparks[idx].supplier=material.supplier;
                  data.sparks[idx].producer=material.producer;
                  data.sparks[idx].name=material.name;
                  data.sparks[idx].incomePrice=material.price;
                  var o ={_id:data._id};

                  var field = 'sparks.'+idx+'.supplier';
                  var field2 = 'sparks.'+idx+'.producer';
                  var field3 = 'sparks.'+idx+'.name';
                  var field4 = 'sparks.'+idx+'.incomePrice';
                  o[field]=data.sparks[idx].supplier;
                  o[field2]=data.sparks[idx].producer;
                  o[field3]=data.sparks[idx].name;
                  o[field4]=data.sparks[idx].incomePrice;
                    var update = field+' '+field2+' '+field3+' '+field4;
                  Jobticket.save({update:update},o,function () {
                      $rootScope.saving=true;
                      $timeout(function(){
                          $rootScope.saving=false;
                      },1500);
                      handleSpark(data.sparks[idx],true);
                  });
              }
              function reCheckMaterial(idx) {
                  handleSpark(data.sparks[idx],true);
              }

                function changeSupplier(idx) {
                    delete data.sparks[idx].changeSupplier;
                    data.sparks[idx].supplier=data.sparks[idx].newSupplier._id;
                    data.sparks[idx].producerName=data.sparks[idx].newSupplier.name;
                    delete data.sparks[idx].newSupplier;
                    var o ={_id:data._id};

                    var field = 'sparks.'+idx+'.supplier';
                    o[field]=data.sparks[idx].supplier;

                    Jobticket.save({update:field},o,function () {
                        $rootScope.saving=true;
                        $timeout(function(){
                            $rootScope.saving=false;
                        },1500);
                        handleSpark(data.sparks[idx]);
                    });
                }
              function changeProducer(idx) {
                  delete data.sparks[idx].changeProducer;
                  //console.log(JSON.stringify(data.sparks[idx].newProducer))
                  data.sparks[idx].producer=data.sparks[idx].newProducer._id;
                  data.sparks[idx].producerName=data.sparks[idx].newProducer.name;
                  delete data.sparks[idx].newProducer;
                  var o ={_id:data._id};
                  var field = 'sparks.'+idx+'.producer';
                  o[field]=data.sparks[idx].producer;

                  Jobticket.save({update:field},o,function () {
                      $rootScope.saving=true;
                      $timeout(function(){
                          $rootScope.saving=false;
                      },1500);
                      handleSpark(data.sparks[idx]);
                  });
              }
                function changeName(idx,name) {
                    delete data.sparks[idx].changeName;
                    data.sparks[idx].name=data.sparks[idx].newName;
                    delete data.sparks[idx].names;
                    delete data.sparks[idx].newName;
                    var o ={_id:data._id};
                    var field = 'sparks.'+idx+'.name';
                    o[field]=data.sparks[idx].name;

                    Jobticket.save({update:field},o,function () {
                        $rootScope.saving=true;
                        $timeout(function(){
                            $rootScope.saving=false;
                        },1500);
                        handleSpark(data.sparks[idx]);
                    });


                }
                self.ok=function(){
                  $q.when()
                      .then(function () {

                          return createByAPI(data,self.workers,self.suppliers);
                      })
                      .then(function () {
                          $uibModalInstance.close(self.name);
                      })
                      .then(function () {
                          exception.showToaster('info','обработка данных в бухгалтерии','все прошло успешно');
                      })
                      .catch(function (err) {
                          console.log(err);
                          if(err){
                              exception.catcher('обработка данных в бухгалтерии',err);
                          }
                      });

                };
                self.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                self.checkOk=function () {
                    if(!data.sparks.length){return true;}
                    return data.sparks.every(function (s) {
                        return s.isInWarehouse;
                    });
                };
            },
            controllerAs:'$ctrl',
            resolve:{
              data:function () {
                return data;
              },
              suppliers:function () {
                return suppliers;
              },
              producers:function () {
                return producers;
              },
                workers:function () {
                return workers;
              }
            }
          });
          modalInstance.result.then(function () {
            resolve();

          }, function (err) {
            reject(err);
          });
        });

      };
    this.makeRn=
      function (data){
        return $q(function(resolve,reject){
          var modalInstance = $uibModal.open({
            animation: true,
            size:'lg',
            windowClass:'modal-check',
            templateUrl: '/components/customer/makeRn.html',
            controller: function($uibModalInstance,$rootScope,$resource,exception,$http,Confirm,data){
                console.log(data)
              var self=this;
              var url = 'http://46.101.131.133:7700/api/collections/Material?page=0&perPage=5&store=5a3cc10e1626aa0566f7ea87&query=';
              var urlForRn = 'http://46.101.131.133:7700/api/collections/createRnByAPI?store=5a3cc10e1626aa0566f7ea87';
                var Rn = $resource('http://46.101.131.133:7700/api/collections/Rn/:id',{id:'@_id',store:'5a3cc10e1626aa0566f7ea87'});
                var Jobticket = $resource('api/jobticket/:id',{id:'@_id'});


                self.itogo={incomeSum:0,sum:0,revenue:0}
                self.changeMaterial=changeMaterial;
              self.reCheckMaterial=reCheckMaterial;
              self.deleteRn=deleteRn;
                self.getHref=getHref;
                self.changePrice=changePrice;
                self.allChecked=true;
                self.changeChecked=function () {
                    data.sparks.forEach(function(s){
                        if(!s.rn){
                            s.inRn=self.allChecked;
                        }
                    });
                }



              activate()

                function activate() {
                    data.sparks.forEach(function(s){
                        s.price=Math.round(s.price*100)/100;
                        if(s.rn){
                            delete s.materials
                            s.inRn=false;
                            s.revenue=Math.round((s.q*(s.price-s.incomePrice))*100)/100
                            s.percent = Math.round(((Math.round(((s.price/s.incomePrice))*100)/100)-1)*100);
                            if(s.percent>0){s.percentClass='green'}else{
                                s.percentClass='red'
                            }
                            self.itogo.revenue+=s.revenue
                            self.itogo.sum+=Math.round((s.q*s.price)*100)/100
                            self.itogo.incomeSum+=Math.round((s.q*s.incomePrice)*100)/100
                            //s.revenue= (s.price).toFixed(2)+'-'+(s.incomePrice).toFixed(2)+'='+(s.revenue).toFixed(2)+'*'+s.q+'='+(s.revenue*s.q).toFixed(2)
                        }else{
                            s.inRn=true;

                        }


                        handleSpark(s);
                    });
                    console.log(self.itogo)
                    self.item = data;
                }

                function changePrice(s){
                    if(s.rn){
                        s.revenue=Math.round((s.q*(s.price-s.incomePrice))*100)/100
                        s.percent = Math.round(((Math.round(((s.price/s.incomePrice))*100)/100)-1)*100);
                        if(s.percent>0){s.percentClass='green'}else{
                            s.percentClass='red'
                        }
                    }
                    self.itogo.incomeSum=0;
                    self.itogo.sum=0;
                    self.itogo.revenue=0;
                    data.sparks.forEach(function(s){
                        s.price=Math.round(s.price*100)/100;
                        if(s.rn) {
                            delete s.materials
                            s.inRn = false;
                            self.itogo.revenue += s.revenue
                            self.itogo.sum += Math.round((s.q * s.price) * 100) / 100
                            self.itogo.incomeSum += Math.round((s.q * s.incomePrice) * 100) / 100
                        }
                    });

                }




              function handleSpark(s,showInfo) {
                  var q = {};
                return $q.when()
                  .then(function () {


                    if(s.sku){
                      q.sku=s.sku;
                    }else if(s.code){
                      q.sku=s.code;
                    }else{
                      return null;
                    }
                    //console.log(q);
                    var urlL = url+JSON.stringify(q);
                    //console.log(url)
                      if(s.rn){return}
                    return $http.get(urlL);
                  })
                  .then(function (res) {
                      if(s.rn){
                          s.result="установлена"
                          return;
                      }

                      s.result='проверяется';
                      s.isInWarehouse=false;
                      s.create=false;
                      delete s.materials;
                      delete s.notInStock;
                      if(res && res.data && res.data.length){
                          res.data.shift();
                          s.materials=[];
                          for(var i =0;i<res.data.length;i++){
                              console.log('res.data[i]',res.data[i]);
                              if(res.data[i].data && res.data[i].data.length){
                                  for(var j =0;j<res.data[i].data.length;j++){
                                      console.log(res.data[i].data[j]);
                                      var o={
                                          name:res.data[i].name,
                                          currency:res.data[i].currency,
                                          supplier:res.data[i].data[j].supplier.name,
                                          price:res.data[i].data[j].price,
                                          priceForSale:res.data[i].data[j].priceForSale,
                                          qty:res.data[i].data[j].qty,
                                          sku : res.data[i].sku,
                                          code :(res.data[i].sku2 && res.data[i].sku2[0])?res.data[i].sku2[0]:'',
                                      };
                                      if(!o.qty){o.disabled=true;}
                                      if(res.data[i].producer){
                                          o.producer=res.data[i].producer.name;
                                          s.materials.push(o);
                                      }else{
                                          exception.showToaster('info','для запчасти '+ res.data[i].name+' не установлен производитель!');
                                      }

                                  }
                              }
                              s.materials.sort(function (a,b) {
                                  return a.qty-b.qty;
                              })

                          }
                          if(s.materials.length){
                              s.result='выберите из списка';
                          }else{
                              s.notInStock=true;
                              s.result='на складе нет прихода';
                          }

                          for(var i=0;i<s.materials.length;i++){
                              if(s.name==s.materials[i].name && s.producer==s.materials[i].producer && s.supplier==s.materials[i].supplier){
                                  if(s.q>s.materials[i].qty){
                                      s.result='на складе не достаточное количество ('+s.materials[i].qty+')';
                                  }else{
                                      s.result='все ок';
                                      s.incomePrice=s.materials[i].price;
                                      s.isInWarehouse=true;
                                  }
                              }
                          }
                      }else{
                          s.result='запчасти с таким кодом  на складе не существует';
                          s.create=true;
                      }
                      if(showInfo){
                          exception.showToaster('info','проверка запчасти '+ q.sku+' произведена');
                      }
                  })
                    .catch(function (err) {
                        s.result='проверяется';
                        s.isInWarehouse=false;
                        s.create=false;
                        delete s.materials;
                        console.log(err)
                        if(err){
                            exception.catcher('проверка запчасти',err);
                        }

                    });
              }
              function changeMaterial(idx,material) {
                  delete data.sparks[idx].materials;
                  data.sparks[idx].supplier=material.supplier;
                  data.sparks[idx].producer=material.producer;
                  data.sparks[idx].name=material.name;
                  var o ={_id:data._id};

                  var field = 'sparks.'+idx+'.supplier';
                  var field2 = 'sparks.'+idx+'.producer';
                  var field3 = 'sparks.'+idx+'.name';
                  o[field]=data.sparks[idx].supplier;
                  o[field2]=data.sparks[idx].producer;
                  o[field3]=data.sparks[idx].name;
                    var update = field+' '+field2+' '+field3;
                  Jobticket.save({update:update},o,function () {
                      $rootScope.saving=true;
                      $timeout(function(){
                          $rootScope.saving=false;
                      },1500);
                      handleSpark(data.sparks[idx],true);
                  });
              }
              function reCheckMaterial(idx) {
                  handleSpark(data.sparks[idx],true);
              }
              function deleteRn(id) {
                  var o={
                      id:id
                  }
                  Confirm("Удалить?")
                      .then(function () {
                          return $http.post('http://46.101.131.133:7700/api/bookkeep/Rn/deleteByAPI?store=5a3cc10e1626aa0566f7ea87',o);
                      })
                      .then(function (res) {
                          if(res && res.data){
                              data.sparks.forEach(function (s) {
                                  if(!s.rn){return};
                                  if(s.rn==id){
                                      s.rn = null;
                                      s.status=1;
                                  }

                              })
                          }
                          $uibModalInstance.close();
                      })
                      .then(function () {
                          exception.showToaster('info','обработка данных в бухгалтерии','накладная удалена');
                      })
                      .catch(function (err) {
                          console.log(err);
                          if(err){
                              exception.catcher('обработка данных в бухгалтерии',err);
                          }
                      });
              }
                function getHref (spark) {
                    var s = "http://www.autofan.kharkov.ua/bookkeep/material?name="+spark.name+'&currency=EUR';
                    if(spark.sku){
                        s+='&sku='+spark.sku;
                        if(spark.code){
                            s+='&sku2='+spark.code;
                        }
                    }else{
                        s+='&sku='+spark.code;
                    }
                    if(spark.producer){
                        s+='&producer='+spark.producer;
                    }
                    return s;
                }


                self.ok=function(){


                  var o ={
                      currency: "EUR",
                      name:'Расходная накладная на наряд '+data.customer.vin,
                      store:'5a3cc10e1626aa0566f7ea87',
                      materials:[],
                      typeOfZakaz: "manufacture",
                      virtualAccount: "СТО",
                      worker: data.worker,
                      zakaz: data._id,
                      invoice:"http://139.162.161.36:3330/admin123/jobTicketArch/view/"+data._id,
                  };


                    data.sparks.forEach(function (s) {
                        if(!s.inRn){return};

                        var m = {};
                        m.name=s.name;
                        if(s.producer){
                            m.producer=s.producer;
                        }else{
                            m.producer='BMW';
                        }
                        if(s.sku){
                            m.sku = s.sku;
                            if(s.code){
                                m.sku2=s.code;
                            }
                        }else if(s.code) {
                            m.sku = s.code;
                        }
                        m.qty = s.q;
                        m.price=s.price;
                        //m.priceForSale = Math.round(s.price*100)/100;
                        //m.price = (s.incomePrice)?Math.round(s.incomePrice*100)/100:0;
                        if(s.supplier){
                            m.supplier=s.supplier;
                        }else{
                            m.supplier="АUTOFAN  Cклад";
                        }
                        o.materials.push(m);

                    });
                    if(!o.materials.length){
                        return exception.catcher('создание накладной','не выбраны материалы');
                    }
                    $q.when()
                      .then(function () {
                          return $http.post('http://46.101.131.133:7700/api/bookkeep/Rn/createByAPI?store=5a3cc10e1626aa0566f7ea87',o);
                      })
                      .then(function (res) {
                          console.log(res)
                          if(res && res.data && res.data.rn){
                              data.sparks.forEach(function (s) {
                                  if(!s.inRn){return};
                                  s.rn = res.data.rn;
                                  s.status=2;
                                  console.log(s)
                              })
                          }
                          $uibModalInstance.close();
                      })
                      .then(function () {
                          exception.showToaster('info','обработка данных в бухгалтерии','накладная создана');
                      })
                      .catch(function (err) {
                          console.log(err);
                          if(err){
                              exception.catcher('обработка данных в бухгалтерии',err);
                          }
                      });

                };
                self.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                self.checkOk=function () {
                    if(!data.sparks.length){return true;}
                    return data.sparks.every(function (s) {
                        return s.isInWarehouse || !s.inRn;
                    });
                };
            },
            controllerAs:'$ctrl',
            resolve:{
              data:function () {
                return data;
              },
            }
          });
          modalInstance.result.then(function () {
            resolve();

          }, function (err) {
            reject(err);
          });
        });

      };


      this.createByAPI=createByAPI;
     function createByAPI(jobTicket) {
         console.log(jobTicket);
          var data  = jobTicket;
          var zakaz={
              customer:{
                  name : data.customer.name,
              }
          };
          if(data.customer.phone){
              zakaz.customer.phone=data.customer.phone;
          }
          if(data.customer.email){
              zakaz.customer.phone=data.customer.email;
          }
          if(data.customer.vin){
              zakaz.customer.field1=data.customer.vin;
          }
          if(data.customer.model){
              zakaz.customer.field2=data.customer.model;
          }
          zakaz.materials=[];
          zakaz.rnsExist=[];
          zakaz.materialsFromRns=[];
          data.sparks.forEach(function (s) {
              var m = {};
              m.name=s.name;
              m.currency='EUR';
              if(s.producer){
                  m.producer=s.producer;
              }else{
                  m.producer='BMW';
              }
              if(s.sku){
                  m.sku = s.sku;
                  if(s.code){
                      m.sku2=s.code;
                  }
              }else if(s.code) {
                  m.sku = s.code;
              }
              m.qty = s.q;
              m.priceForSale = Math.round(s.price*100)/100;
              m.price = (s.incomePrice)?Math.round(s.incomePrice*100)/100:0;
              if(s.supplier){
                  m.supplier=s.supplier;
              }else{
                  m.supplier="АUTOFAN  Cклад";
              }

              if(s.rn){
                  if(zakaz.rnsExist.indexOf(s.rn)<0){
                      zakaz.rnsExist.push(s.rn);
                  }
                    m.rn = s.rn;
                  zakaz.materialsFromRns.push(m);
              }else{
                  zakaz.materials.push(m);
              }
          });
          zakaz.virtualAccount='СТО';
          zakaz.currency='UAH';
          zakaz.currencyRn='EUR';
          /*if(data.createByAPI){
              zakaz.createByAPI=data.createByAPI;
          }*/
          zakaz.comment='Заказ открыт '+moment(data.date).format('LLL')+' закрыт '+moment().format('LLL');
          if(data.mile){
              zakaz.comment+=', пробег '+data.mile;
          }
          zakaz.link ="http://139.162.161.36:3330/admin123/jobTicketArch/view/"+data._id;

          zakaz.works=[];
          zakaz.purchase=[];
          zakaz.pays =[];
          if(data.pay && data.pay.length){
              data.pay.forEach(function (p) {
                  var item ={
                      date:p.date,
                      debet:p.val,
                      currency:'EUR'
                  }
                  zakaz.pays.push(item)
              })
          }
         if(data.payGrn && data.payGrn.length){
             data.payGrn.forEach(function (p) {
                 var item ={
                     date:p.date,
                     debet:p.val,
                     currency:'UAH'
                 }
                 zakaz.pays.push(item)
             })
         }
         if(data.exchange && data.exchange.length){
             zakaz.exchange = data.exchange;
         }
          data.jobs.forEach(function (job) {
              //console.log(job)
              if(job.supplierType){
                  var w ={
                      supplier:job.supplier,
                      qty:1,//job.q,
                        incomeSum:job.incomeSum,
                      sum:job.sum,
                      name:job.name,
                      currency:job.currency||'UAH'
                  };
                  zakaz.purchase.push(w);
              }else{
                  var w ={
                      worker:job.worker,
                      workingHour:job.norma,
                      qty:job.q,
                      sum:job.sum,
                      name:job.name
                  };
                  //w.qty=job.sum/
                  zakaz.works.push(w);
              }

          });
          //console.log('data.worker',data.worker)
          if(data.worker){
              zakaz.worker=data.worker;
          }

            console.log(zakaz);

          return $q.when()
              .then(function () {
                  //throw 'test';
                  //return $http.post('http://139.162.161.36:7700/api/bookkeep/Zakaz/createByAPI?store=5a3cc10e1626aa0566f7ea87',zakaz)
                  return $http.post('http://46.101.131.133:7700/api/bookkeep/Zakaz/createByAPI?store=5a3cc10e1626aa0566f7ea87',zakaz);
              })
              .then(function (res) {
                  console.log(res);
                  if(res && res.data){
                      jobTicket.createByAPI= res.data.createByAPI;
                  }

                  //console.log(res)
              });

      }



  };
})();
/*KX28167*/
/*
* 1. Обнуление данных по поставщикам
* 2. Инвентаризация по складу
* 3. Платежная ведомость по зп
* 4. Отчет о прибыли*/

/*изменение формата ввода количества запчастей
*Проверить наличие карточки товара на складе.
* Сделать возможным добавлять товар из уже имеющихся кодов/артикулов. В случае если нет - сделать возможным создать карточку товара
* создавала карточку, прям внутри сервисной программы
*
*
* Так же сделай возможным добавлять производителя этим же способом*/
