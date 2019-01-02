'use strict';

/* Controllers */

angular.module('myApp.controllers', [])



    .controller('mainFrameCtrl',['$scope', '$location', function ($scope, $location) {
        //$scope.menuItem=Categories.list();
        $scope.foo = function(){
            console.log('sd');
        }
        $scope.toMainSite = function(){
            //console.log('dddd');
            window.location = '/';
            //$location.path('/');
        }
        $scope.moment=moment;
        $scope.moment.lang('ru');


        $scope.printTicket = function(){
            $scope.$broadcast('printTicket');
        }



    }])
    .controller('homeCtrl', ['$scope','$http',function ($scope,$http) {

    }])


    .controller('filtersCtrl', ['$scope','$http','Filters','$rootScope','Tags',function ($scope,$http,Filters,$rootScope,Tags) {
        //$scope.lanArr=$rootScope.lanArr;
        $scope.editDisabledF=true;
        $scope.editDisabledT=true;

        $scope.focusInput=[];
        $scope.focusInputTag=[];
        $scope.activeFilter=$rootScope.activeM;
        $scope.filter={};
        $scope.filter.name={"ru":'',"ua":'',"en":''};
        $scope.filter.index=1;
        $scope.tag={};
        $scope.tag.name={"ru":'',"ua":'',"en":''};
        $scope.tag.index=1;

        function getFilters(){
            $scope.filters=Filters.list(function(){
                /*if ($scope.activeFilter== null && $scope.filters.length>0 ){
                    $scope.activeFilter=$scope.filters[0]._id;
                    $scope.activeFilterName=$scope.filters[0].name[$rootScope.config.DL];
                    Filters.get({id:$scope.activeFilter},function(filter){
                        $scope.tags=filter.tags;
                    });
                    //$scope.tags=Tags.list({'filter':$scope.activeFilter});
                }*/
            });
        }
        getFilters();
        $scope.editFilter = function(filter,edit){
            if (edit)
                $scope.editDisabledF=false;
            else
                $scope.editDisabledF=true;
            if (!filter){
                $scope.activeFilter=null;
                $scope.activeFilterName=null;
                $scope.filter={};
                $scope.filter.name={"ru":'',"ua":'',"en":''};
                $scope.filter.index=1;
                $scope.filter.type=1;
                $scope.filter.tags=[];
                $scope.tags=[];

            }
            else {
                $scope.activeFilter=filter._id;
                $scope.activeFilterName=filter.name[$rootScope.config.DL];
                $scope.filter=Filters.get({'id':filter._id},function(){
                    //console.log($scope.filter);
                    if ($scope.filter.type !=1 && $scope.filter.type!=2){
                        console.log('1');
                        $scope.filter.type=1;
                    }
                    $scope.tags= Tags.list({'filter':$scope.filter._id});
                });

            }
        }

        $scope.saveFilter = function(){
           //console.log($scope.filter);

            function afterSave(){
                $scope.filter.name={"ru":'',"ua":'',"en":''};
                $scope.filter.index=1;

                $scope.filters=Filters.list(function(){
                    /*if(!$scope.activeFilter)
                        $scope.activeFilter=  $scope.filters[0]._id;
                    $scope.filters.forEach(function(el){
                        if (el._id==$scope.activeFilter)
                            $scope.activeFilterName=el.name[$rootScope.config.DL];
                    });
                    $scope.filter= Filters.get({'id':$scope.activeFilter},function(){
                        $scope.tags=$scope.filter.tags;
                    });*/
                });
                $scope.editDisabledF=true;
                $scope.filter.type=0;

            }
            if (!$scope.filter._id){
                Filters.add($scope.filter,function(){
                    afterSave()
                })
            } else{
                $scope.filter.$update(function(err){
                    if (err) console.log(err);
                    afterSave()
                });
            }
        }
        $scope.deleteFilter = function(filter){
            if (confirm("Удалить?")){
              if (filter._id == $scope.activeFilter){
                   $scope.activeFilter= null;
              }
                filter.$delete(function(err,res){
                    getFilters()

                });
            }
        }

        $scope.editTag = function(tag){
            //console.log(tag);
            if (!$scope.activeFilter) return;
            //$rootScope.activeArticle = id;
            $scope.editDisabledT=false;
            if (!tag){
                $scope.tag={};
                $scope.tag.name={"ru":'',"ua":'',"en":''};
                $scope.tag.index=1;
            } else {
                console.log(tag);
                $scope.tag=tag;
            }
            $scope.tag.filter=$scope.activeFilter;
        }
        $scope.saveTag = function(){
            // console.log($scope.filter);
            function afterSave(){
                $scope.tag.name={"ru":'',"ua":'',"en":''}
                $scope.tag.index=1;
                $scope.tags=Tags.list({'filter':$scope.activeFilter},function(){
                    /*$scope.filters.forEach(function(el){
                        if (el._id==$scope.activeFilter)
                            el.tags=$scope.tags;
                    });*/
                });
                $scope.editDisabledT=true;
            }
            if (!$scope.tag._id){
                Tags.add($scope.tag,function(){
                    afterSave()
                })
            } else{
                Tags.update($scope.tag,function(err){
                    if (err) console.log(err);
                    afterSave();
                });
            }
        }
        $scope.deleteTag = function(tag){
            if (confirm("Удалить?")){
                /*if (issue._id == $scope.activeIssue)
                    $scope.activeIssue= null;*/
                /*tag.filter=$scope.activeFilter;
                console.log(tag);*/
                Tags.delete({'filter':$scope.activeFilter,'id':tag._id},function(err,res){
                    $scope.tags=Tags.list({'filter':$scope.activeFilter});

                });
            }
        }




    }])

    .controller('goodsCtrl', ['$scope','Goods','$stateParams','$rootScope','$fileUpload',"Categories","$timeout",'$location', '$anchorScroll','$sce',
        function ($scope,Goods,$stateParams,$rootScope,$fileUpload,Categories,$timeout,$location, $anchorScroll,$sce) {

            $scope.trustHtml = function(text){
                return $sce.trustAsHtml(text)
            };
            //$scope.saved=false;
            $scope.type=parseInt($stateParams.id);
            $scope.goods= Goods.list($stateParams);
            $scope.good={};
            $scope.good.category=1;
            /*Categories.list(function(res){
                //console.log(res);
                $scope.categories=res[$scope.type]
                //console.log($scope.categories)
            });*/
            //console.log($stateParams);
            $scope.categories=Categories.get($stateParams);

            $scope.section=0;

            $scope.editGood= function(good){
                $scope.focusInput=true;
                if (!good){
                    $scope.noChange=true;
                    $scope.good = {}//new Goods();
                    $scope.good.category=1;
                    $scope.activeGoodName='нова';
                    $scope.myFileSrc='/' + '?' + new Date().getTime();
                }
                else{
                    $scope.noChange=false;
                    $scope.good = good;
                    $scope.activeGoodName=good.name.ua;
                    //console.log($scope.good.img);
                    if ($scope.myFileSrc=$scope.good.img){}else
                        $scope.myFileSrc='/' + '?' + new Date().getTime();

                }

            }


            $scope.updateGood = function(){
                if($scope.categories.stuff.length<1){
                    $scope.good.category=0;
                }
                if (!$scope.good._id){
                    $scope.good.type=$scope.type;
                    Goods.add($scope.good,function(res){
                        $scope.afterSave(res);
                     })
                } else{
                    $scope.good.$update(function(res){
                        $scope.afterSave(res);
                    });
                }
            }

            $scope.afterSave = function(res){
                if (res.err){
                    $scope.mongoError = res.err;
                    $scope.mongoErrorShow = true;
                    $timeout(function(){$scope.mongoErrorShow=false;},3500);
                }
                $scope.goods= Goods.list($stateParams);
                $scope.saved=true;
                $timeout(function(){$scope.saved=false;},3500);
                $location.hash('top');
                $anchorScroll();
                $scope.activeGoodName='';
                $scope.myFileSrc='/' + '?' + new Date().getTime();
                $scope.good={};
                $scope.good.category=1;
            }


            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "api/goods/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.good._id).then(function(promise){
                    /*$scope.code = promise.code();
                    $scope.fileName = promise.fileName();*/
                    $scope.noChange=false;
                    $scope.goods= Goods.list($stateParams);
                    $scope.loaded=true;
                    $timeout(function(){$scope.loaded=false;},3500);
                });
            };

            $scope.deleteGood = function(good){
                if (confirm("Удалить?")){
                    good.$delete(function(err){
                        $scope.goods= Goods.list($stateParams);
                        $scope.noChange=true;
                        $scope.good = {}//new Goods();
                        $scope.myFileSrc='/' + '?' + new Date().getTime();
                    });
                }
            }



        }])

    .controller('commentsCtrl', ['$scope','Goods','$stateParams','$rootScope',"$timeout","Comments","Categories",
        function ($scope,Goods,$stateParams,$rootScope,$timeout,Comments,Categories) {
            //$scope.saved=false;
            $scope.goodId=parseInt($stateParams.id);
            $scope.comments = Comments.list($stateParams);
            $scope.comment={};
            $scope.good= Goods.get($stateParams,function(){
                $scope.category=Categories.get({id:$scope.good.type});
            });

            $scope.editComment= function(comment){
                $scope.focusInput=true;
                if (!comment){
                    $scope.comment = {}
                    $scope.comment.idGood=$stateParams.id;
                    $scope.activeCommentName='новый';
                }
                else{
                    $scope.comment = Comments.get({id:$stateParams.id,idC:comment._id},function(){
                        $scope.comment.idGood=$stateParams.id;
                    });
                    $scope.activeCommentName=comment.author;
                }
            }


            $scope.updateComment = function(){
                $scope.comment.id=$stateParams.id;
                if (!$scope.comment._id){

                    Comments.add($scope.comment,function(res){
                        $scope.afterSave(res);
                    })
                } else{
                    $scope.comment.$update(function(res){
                        $scope.afterSave(res);
                    });
                }
            }

            $scope.afterSave = function(res){
                if (res.err){
                    $scope.mongoError = res.err;
                    $scope.mongoErrorShow = true;
                    $timeout(function(){$scope.mongoErrorShow=false;},3500);
                }
                $scope.comments= Comments.list($stateParams);
                $scope.saved=true;
                $timeout(function(){$scope.saved=false;},3500);
                $scope.activeCommentName='';
                $scope.comment={};
            }
            $scope.deleteComment = function(comment){
                if (confirm("Удалить?")){
                    comment.idGood=$stateParams.id;
                    comment.$delete(function(err){
                        $scope.comments= Comments.list($stateParams);
                        $scope.comment = {};
                    });
                }
            }



        }])
    .controller('uploadFileCtrl', ['$scope','$fileUpload',function ($scope,$fileUpload) {
       $scope.uploadFile = function(){
            var file = $scope.myFile;
            $scope.noLoad=true;
            var uploadUrl = "api/fileUploadPdf";
            $fileUpload.uploadFileToUrl(file, uploadUrl).then(function(promise){
                $scope.noLoad=false;
            });
        };
    }])

    .controller('brandsCtrl', ['$scope','Brands','$stateParams','$rootScope','$fileUpload','Category','Country','Region','City','$timeout',
        function ($scope,Brands,$stateParams,$rootScope,$fileUpload,Category,Country,Region,City,$timeout) {
          $scope.brands= Brands.list();


            $scope.editBrand= function(brand){
                var id =(brand)?brand._id:'';
                $rootScope.$state.transitionTo('mainFrame.brands.edit',{'id':id});
            }


            $scope.deleteBrand = function(brand){
                if (confirm("Удалить?")){
                    brand.$delete(function(err){
                        if (err) console.log(err);
                        $scope.brands= Brands.list();
                    });
                }
            }
            $scope.$watch('changeBrand',function(){
                if ($rootScope.changeBrand){
                    $scope.brands= Brands.list();
                }
                $rootScope.changeBrand=false;
            })
       }])

    .controller('brandsEditCtrl', ['$scope','Brands','$stateParams','$rootScope','$fileUpload','Category','Country','Region','City','$timeout','BrandTags',
        function ($scope,Brands,$stateParams,$rootScope,$fileUpload,Category,Country,Region,City,$timeout,BrandTags) {
            //$scope.categories =Category.list();
            $scope.focusInput=[];
            $scope.focusInputBrandTag=[];
            $scope.countries= Country.list();
            $scope.regions= [];//Region.list();
            $scope.cities= [];//City.list();
            $scope.brandTag={};
            $scope.brandTag.name={"ru":'',"ua":'',"en":''};
            $scope.brandTag.index=1;
            $scope.editDisabledTag= true;
            $scope.editTagShow=false;
            $scope.showThumb=true;

            $scope.editBrandTag= function(tag){
                //console.log(tag);
                $scope.editTagShow=true;
                $scope.focusInputBrandTag[0]=true;
                $scope.editDisabledTag= false;
                if (!tag){
                    $scope.brandTag={};
                    $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                    $scope.brandTag.index=1;
                } else {
                    $scope.brandTag=tag;
                }
            }
            $scope.saveBrandTag= function(){
                $scope.editDisabledTag= true;
                $scope.editTagShow=false;
                console.log('sdss');

                if (!$scope.brandTag._id){
                    $scope.brandTag.brand=$scope.brand._id;
                    BrandTags.add($scope.brandTag,function(){
                        $scope.brandTags=BrandTags.list({brand:$scope.brand._id});
                        $scope.brandTag={};
                        $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                        $scope.brandTag.index=1;
                    })
                } else{
                    $scope.brandTag.$update(function(err){
                        //  if (err) console.log(err);
                        $scope.brandTags=BrandTags.list({brand:$scope.brand._id});
                        $scope.brandTag={};
                        $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                        $scope.brandTag.index=1;
                    });
                }

            }
            $scope.deleteBrandTag= function(brandTag){
                $scope.editDisabledTag= true;
                $scope.editTagShow=false;
                brandTag.$delete(function(err){
                    if (err) console.log(err);
                    $scope.brandTag={};
                    $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                    $scope.brandTag.index=1;
                    $scope.brandTags=BrandTags.list({brand:$scope.brand._id});
                });
            }




            /*$scope.changeCountry = function(country){
                console.log(country);
            }*/

            $scope.$watch('country',function(){
                if  ($scope.country){
                    $scope.regions=Region.list({country:$scope.country},function(){
                        $timeout(function(){$scope.region=$scope.brand.region;},100);
                    });
                }
            });
            $scope.$watch('region',function(){
                if  ($scope.region){
                    $scope.cities=City.list({region:$scope.region},function(){
                        $timeout(function(){$scope.city=$scope.brand.city;},100);
                    });
                }
            });

            $scope.editBrand= function(brand){
                $scope.focusInput[0]=true;
                $scope.categoryList=[];
                $scope.editDisabled=false;
                if (!brand._id){
                    $scope.brand={};
                    $scope.brand.name={"ru":'',"ua":'',"en":''};
                    $scope.brand.desc={"ru":'',"ua":'',"en":''};
                    $scope.brand.index=1;
                    //$scope.country=($scope.countries.length>0)?$scope.countries[0]._id:{};
                    $scope.country='';
                    $scope.city='';
                    $scope.region='';
                    $scope.noChange=true;
                    $scope.brandTags =[];
                    //$scope.myFileSrc='/' + '?' + new Date().getTime();
                }
                else{
                    $scope.noChange=false;
                    $scope.brand = Brands.get(brand,function(){
                        $scope.brandTags=BrandTags.list({brand:$scope.brand._id});
                        $scope.myFileSrc=$scope.brand.img;
                        if ($scope.brand.country){
                            $scope.country=$scope.brand.country;
                        } else {
                            $scope.country='';
                        }
                        /*if ($scope.brand.categories && $scope.brand.categories.length>0){
                            $scope.categories.forEach(function(el){
                                if($scope.brand.categories.indexOf(el._id)>-1){
                                    $scope.categoryList.push(el.name[$rootScope.config.DL]);
                                }
                            })
                        }*/
                    });
                    //$scope.myFileSrc='/' + '?' + new Date().getTime();
                }
            }


            $scope.afterSave=function(){
                $rootScope.$state.transitionTo('mainFrame.brands');
                $rootScope.changeBrand=true;


            }

            $scope.updateBrand = function(){
                //console.log($scope.country);
                $scope.brand.city = $scope.city;
                $scope.brand.country =$scope.country;
                $scope.brand.region =$scope.region;

                if (!$scope.brand._id){
                    Brands.add($scope.brand,function(){
                        $scope.afterSave();
                    })
                } else{
                    $scope.brand.$update(function(err){
                        //  if (err) console.log(err);
                        $scope.afterSave();
                    });
                }
            }



            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/brandfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.brand._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    $scope.brands= Brand.list();
                });
            };

            $scope.editBrand({_id:$rootScope.$stateParams.id});

        }])

    .controller('categoryCtrl', ['$scope','Category','$rootScope','Brands','Filters',
        function ($scope,Category,$rootScope,Brands,Filters) {
            $scope.categories= Category.list();
            //$scope.changeCategory=$rootScope.changeCategory;
           /* $scope.getTags=function(){
                $scope.categories= Category.list();
                *//*$scope.brandTags = [];
                $scope.brands = Brands.list(function(){
                    $scope.brands.forEach(function(el){
                        $scope.brandTags.push({'id':el._id,'label':el.name[$rootScope.config.DL],'index':el.index});
                    });
                });*//*
                *//*$scope.filterTags = [];
                $scope.filters = Filters.list(function(){
                    $scope.filters.forEach(function(el){
                        $scope.filterTags.push({'id':el._id,'label':el.name[$rootScope.config.DL],'index':el.index});
                    });
                });*//*
            }
*/


            $scope.editCategory = function(category){
                //console.log('dd');
                var id =(category)?category._id:'';
                $rootScope.$state.transitionTo('mainFrame.category.edit',{'id':id});

            }

            $scope.$watch('changeCategory',function(){
                //console.log('sdf111');
                if ($rootScope.changeCategory){
                    //console.log('ddddd');
                    //$scope.categories= Category.list(function(){});
                    //$scope.getTags();
                    $scope.categories= Category.list();
                }
                $rootScope.changeCategory=false;
            })

            $scope.deleteCategory = function(category){
                if (confirm("Удалить?")){
                    category.$delete(function(err){
                        if (err) console.log(err);
                        $scope.getTags();
                    });
                }
            }
           // $scope.getTags();
        }])

    .controller('categoryEditCtrl', ['$scope','Category','$rootScope','$fileUpload','Brands','Filters','$timeout',
        function ($scope,Category,$rootScope,$fileUpload,Brands,Filters,$timeout) {
            //console.log('ssss');
            $scope.editDisabled=false;
            $scope.focusInput=[];
            $scope.focusInput[0]=true;
            $scope.category={};
            $scope.category.name={"ru":'',"ua":'',"en":''};
            $scope.category.desc={"ru":'',"ua":'',"en":''};
            $scope.category.index=1;
            $scope.category.brands=[];
            $scope.category.filters=[];
            $scope.categoryTags=[];
            $scope.selectBrand='';


            // brands
            $scope.brandList=[];

            $scope.brandTags = [];
            Brands.list(function(brands){
                for(var i=0; i<brands.length;i++){
                    $scope.brandTags.push({'id':brands[i]._id,'label':brands[i].name[$rootScope.config.DL],'index':brands[i].index});
                };
            });

            $scope.$watch("selectBrand",function(){

                if (!$scope.selectBrand) return;
                var i = $scope.brandTags.indexOf($scope.selectBrand);

                $scope.brandList.push($scope.selectBrand);
                $scope.brandTags.splice(i, 1);
                $scope.selectBrand='';
            })

            $scope.removeBrand=function(brand){


                var i = $scope.brandList.indexOf(brand);
                $scope.brandTags.push(brand);
                $scope.brandList.splice(i,1);
                $scope.disabledButton=false;
                //$rootScope.changeCategory=true;
            }
            //filters
            $scope.filterTags = [];
            Filters.list(function(filters){
                for(var i =0; i<filters.length;i++){
                    $scope.filterTags.push({'id':filters[i]._id,'label':filters[i].name[$rootScope.config.DL],'index':filters[i].index});
                };
            });


            $scope.filterList=[];
            $scope.$watch("selectFilter",function(){
                if (!$scope.selectFilter) return;
                var i=$scope.filterTags.indexOf($scope.selectFilter);
                $scope.filterList.push($scope.selectFilter);
                $scope.filterTags.splice(i, 1);
                $scope.selectFilter='';
            })
            $scope.removeFilter=function(filter){
                if (filter.id==$scope.category.mainFilter) return;
                var i=$scope.filterList.indexOf(filter);
                $scope.filterTags.push(filter);
                $scope.filterList.splice(i,1);
                $scope.disabledButton=false;
            }

            // categories
            function getSections(){
                $scope.categoryTags=[];
                $scope.categoryTags.push({'id':'','label':'Корневой','index':0});
                $scope.categories.forEach(function(el){
                    if (!el.section)
                        $scope.categoryTags.push({'id':el._id,'label':el.name[$rootScope.config.DL],'index':el.index});
                });
            }




            $scope.editCategory= function(category){
                $scope.editDisabled=false;
                $scope.selectMainFilter;
                $scope.myFileSrc='/' + '?' + new Date().getTime();
                if (!category._id){
                    $scope.category={};
                    $scope.category.name={"ru":'',"ua":'',"en":''};
                    $scope.category.desc={"ru":'',"ua":'',"en":''};
                    $scope.category.index=1;
                    $scope.category.brands=[];
                    $scope.category.filters=[];
                    $scope.noChange=true;
               } else{
                    $scope.noChange=false;
                    $scope.category = Category.get(category,function(){
                        if ($scope.category.mainFilter){
                            $scope.selectMainFilter=$scope.category.mainFilter;
                        }
                        $scope.myFileSrc=$scope.category.img;
                        $timeout(function(){
                            for (var i=0;i<$scope.brandTags.length;i++){
                                if ($scope.category.brands.indexOf($scope.brandTags[i].id)>-1){
                                    $scope.brandList.push($scope.brandTags[i]);
                                    $scope.brandTags.splice(i, 1);
                                    i--;
                                }
                            }
                        },500);
                        $timeout(function(){
                            for (var i=0;i<$scope.filterTags.length;i++){
                                if ($scope.category.filters.indexOf($scope.filterTags[i].id)>-1){
                                    $scope.filterList.push($scope.filterTags[i]);
                                    $scope.filterTags.splice(i, 1);
                                    i--;
                                }
                            }
                        },500);
                    });
                }
            }


            $scope.afterSave=function(){
                $rootScope.$state.transitionTo('mainFrame.category');
                $rootScope.changeCategory=true;
            }

            $scope.updateCategory = function(){
                if ($scope.selectMainFilter && !$scope.category.mainFilter){
                    $scope.category.mainFilter=$scope.selectMainFilter;
                }
                var i;
                for(i=0; i<=$rootScope.config.langArr.length-1;i++){
                    $scope.category.name[$rootScope.config.langArr[i]]=$scope.category.name[$rootScope.config.langArr[i]].substring(0,25);
                }
                for(i=0;i<=$rootScope.config.langArr.length-1;i++){
                    $scope.category.desc[$rootScope.config.langArr[i]]=$scope.category.desc[$rootScope.config.langArr[i]].substring(0,1000);
                }


                $scope.category.brands=[];
                $scope.category.filters=[];
                //console.log($scope.category.section);
                if ($scope.category.section){
                    $scope.brandList.forEach(function(el){
                        $scope.category.brands.push(el.id);
                    })

                    $scope.filterList.forEach(function(el){
                        $scope.category.filters.push(el.id);
                    })
                } else{
                    $scope.category.section=null;
                }
                if (!$scope.category._id){
                    Category.add($scope.category,function(){
                        $scope.afterSave();
                    })
                } else{
                    $scope.category.$update(function(err){
                        // if (err) console.log(err);
                        $scope.afterSave();
                    });

                }
            }


            $scope.myFile={};
            $scope.noLoad=true;
            //$scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/categoryfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.category._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    $scope.categories= Category.list();
                });
            };


            $timeout(function(){getSections();},50)
            $scope.editCategory({_id:$rootScope.$stateParams.id});


        }])


.controller('stuffCtrl', ['$scope','Brands','$rootScope','Category','Filters','Stuff','$q','$timeout','BrandTags',
        function ($scope,Brands,$rootScope,Category,Filters,Stuff,$q,$timeout,BrandTags) {
            $scope.sections=[];
            $scope.activeCategory='';
            $scope.activeBrand='';
            $scope.categoryList=[];
            $scope.brandList=[];
            $scope.filtersList=[];
            $scope.collectionList=[];
            $scope.collectionTag={};

            $scope.stuffList=[];
            //paginator
            $scope.page=1;
            //$scope.numPages=2;
            $scope.totalItems=0;
            //$scope.maxSize = 5;
            //$scope.perPage =3;
            var defer = $q.defer();
            var promises = [];
            $scope.isopenCategory=true;
            $scope.isopenBrand=true;
            $scope.isopenFilter=false;
            $scope.isopenCollection=false;


            //console.log( $scope.filterList);
            $scope.filters=Filters.list();

            // инициализация********************************
            $scope.categories =Category.list(function(){
                $scope.categories.forEach(function(el){
                    if(!el.section){
                        $scope.sections.push({"id":el._id,"label":el.name[$rootScope.config.DL]});
                    }
                })
                /*if ($scope.sections.length>0)
                    $scope.section=$scope.sections[0];*/

                $scope.brands=Brands.list(function(){
                    if ($scope.sections.length>0)
                        $scope.section=$scope.sections[0];
                    //$scope.changeSection($scope.section);
                });
            });
            //*********************************************

            $scope.$watch('section',function(){
                //console.log('ddd');
                if ($scope.section){
                    $scope.changeSection($scope.section);
                }
            });
            $scope.changeSection = function(section){
                //console.log($scope.section.id);
                $scope.totalItems=0;
                $scope.activeCategory='';
                $scope.activeBrand='section';
                $scope.filtersList=[];
                $scope.brandList = $scope.getBrandList($scope.section.id);
                $scope.categoryList = $scope.getCategoryList($scope.section.id);
                $scope.stuffs=$scope.getStuffList($scope.section.id,$scope.activeBrand)
                $scope.activeBrand='';

            };

            $scope.getBrandList= function(sectionId){
                //console.log(sectionId);
                var tempArrForId=[];
                var arr=[];
                $scope.categories.forEach(function(el){
                    //console.log(el);
                    if (el.section==sectionId){
                        //console.log(el.brands);
                        if ( el.brands && el.brands.length>0){
                            el.brands.forEach(function(item){
                                if (tempArrForId.indexOf(item)<0){
                                    tempArrForId.push(item);
                                    for (var i=0 ; i<=$scope.brands.length - 1; i++) {
                                        if ($scope.brands[i]._id==item){
                                            arr.push($scope.brands[i]);
                                            break;
                                        }
                                    }
                                }
                            })
                        }
                    }

                })
                return arr;
            }

            $scope.getCategoryList= function(sectionId){
                var arr=[];
                $scope.categories.forEach(function(el){
                    if (el.section==sectionId){
                        arr.push(el);
                    }
                })
                return arr;
            }


            function getBr(brandIdArr,arr){
                brandIdArr.forEach(function(item){
                        for (var i=0 ; i<=$scope.brands.length - 1; i++) {
                            if ($scope.brands[i]._id==item){
                                arr.push($scope.brands[i]);
                                break;
                            }
                        }
                })
            };

            $scope.getFt=function (filterArr,arr){

                filterArr.forEach(function(item){
                    for (var i=0 ; i<=$scope.filters.length - 1; i++) {
                        if ($scope.filters[i]._id==item){
                            var temp={};temp=$scope.filters[i];
                            temp.value='';
                            $scope.filters[i].value='';
                            //arr.push(temp);
                            arr.push($scope.filters[i]);
                            break;
                        }
                    }
                })
                $scope.isopenFilter=(arr.length>0)?true:false;
            }
            $scope.clearFilter = function(){
                if ($scope.filtersList.length>0){
                    for (var i=0 ; i<=$scope.filtersList.length - 1; i++) {
                        $scope.filtersList[i].value='';
                    }
                }
                //console.log($scope.filtersList);
            }

            $scope.choiceCategory = function(category){
                /*console.log($scope.activeBrand);
                console.log(category);*/
                $scope.totalItems=0;
                if (!category) {
                   // console.log('sss');
                    if (!$scope.activeBrand){
                        $scope.changeSection();
                    } else {
                        //console.log('dddddd');
                        $scope.activeCategory='0';
                        //$scope.filtersList=[];
                        $scope.stuffs=$scope.getStuffList($scope.activeCategory,$scope.activeBrand)
                        $scope.activeCategory='';
                    }
                    return;
                }
                $scope.activeCategory=category._id;
                $scope.brandList=[];
                if (category.brands && category.brands.length>0){
                    getBr(category.brands,$scope.brandList);
                }
                $scope.filtersList=[];
                //console.log(category);
                if (category.filters && category.filters.length>0){
                    $scope.getFt(category.filters,$scope.filtersList);
                }
                $scope.getStuffList($scope.activeCategory,$scope.activeBrand)

            }


            function getCr(categoryIdArr,arr){
                categoryIdArr.forEach(function(item){
                    for (var i=0 ; i<=$scope.categories.length - 1; i++) {
                        if ($scope.categories[i]._id==item && $scope.categories[i].section==$scope.section.id){
                            arr.push($scope.categories[i]);
                            break;
                        }
                    }
                })
            };


            $scope.$watch('activeBrand',function(){
                //console.log($scope.activeBrand);
                $scope.collectionList=[];

                if ($scope.activeBrand && $scope.activeBrand!='section'){
                    //console.log($scope.activeBrand);
                    $scope.collectionList= BrandTags.list({brand:$scope.activeBrand});
                    $scope.collectionTag.val=''

                }
            })
            $scope.clearBrandTag = function(tag){
                console.log(tag);
                tag.val='';
            }

            $scope.choiceBrand = function(brand){
                /*console.log(brand);
                console.log($scope.activeCategory);*/
                $scope.totalItems=0;
                if (!brand) {
                    if (!$scope.activeCategory){
                        $scope.changeSection();
                    } else {
                        $scope.activeBrand='0';
                        $scope.stuffs=$scope.getStuffList($scope.activeCategory,$scope.activeBrand)
                        $scope.activeBrand='';
                    }
                    return;
                }
                $scope.activeBrand=brand._id;
                $scope.categoryList=[];
                if (brand.categories && brand.categories.length>0){
                    getCr(brand.categories,$scope.categoryList);
                }
                $scope.getStuffList($scope.activeCategory,$scope.activeBrand);
            }


            $scope.getStuffList = function(categoryId,brandId,page){
                if (!page){
                    $scope.page=1;
                    $scope.stuffList=[];
                }
                if (!categoryId) categoryId=0;
                if (!brandId) brandId=0;
                if (categoryId==0 && brandId==0){
                    categoryId=$scope.section.id;
                    brandId='section';
                }

                Stuff.list({category:categoryId,brand:brandId,page:$scope.page},function(tempArr){
                   /* if ($scope.stuffList.length<=0 && tempArr.length>0){
                        $scope.totalItems=tempArr[0].index;
                    }*/
                    if ($scope.page==1 && tempArr.length>0){
                        $scope.totalItems=tempArr[0].index;
                    }
                    //console.log($scope.totalItems);
                    for (var i=0 ; i<=tempArr.length - 1; i++) {
                       // tempArr[i].filters=JSON.parse(tempArr[i].filters);
                        $scope.stuffList.push(tempArr[i]);
                    }
                });
            }
            //Angularjs promise chain when working with a paginated collection
            //http://stackoverflow.com/questions/20171928/angularjs-promise-chain-when-working-with-a-paginated-collection
            $scope.loadData = function(numPage) {
                //console.log(numPage);
                if (!numPage) numPage=1;
                var deferred = $q.defer();
                var i=1;

                if (!$scope.activeBrand && !$scope.activeCategory){
                    var brandId='section';
                } else {
                    //console.log();
                    var brandId=($scope.activeBrand)?$scope.activeBrand:0;
                }
                $scope.totalItems=0;
                var categoryId=($scope.activeCategory)?$scope.activeCategory:$scope.section.id;
                if ($scope.activeBrand && !$scope.activeCategory){
                    categoryId=0;
                }

                //console.log($scope.activeCategory);
                $scope.stuffList=[];
                function loadAll() {
                    Stuff.list({category:categoryId,brand:brandId,page:i},function(stuffs){
                        //console.log(stuffs);
                        if ($scope.stuffList.length<=0 && stuffs.length>0){
                            $scope.totalItems=stuffs[0].index;
                        }
                        for(var ii=0; ii<=stuffs.length-1;ii++){
                            $scope.stuffList.push(stuffs[ii]);
                        }
                            if(i<numPage) {
                                i++;
                                loadAll();
                            }
                            else {
                                deferred.resolve();
                            }
                        })
                }
                loadAll();
                return deferred.promise;
            };




            $scope.editStuff = function(stuff){
               //console.log('dd');
                var id =(stuff)?stuff._id:'';
                $rootScope.$state.transitionTo('mainFrame.stuff.edit',{'id':id});

            }

            $scope.deleteStuff = function(stuff){
                if (confirm("Удалить?")){
                    stuff.$delete(function(err){
                        if (err) console.log(err);
                        $rootScope.changeStuff=true;
                        //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                    });
                }
            }

            $scope.setPage = function () {
                $scope.page++;
                $scope.getStuffList($scope.activeCategory,$scope.activeBrand,$scope.page);
                //console.log($scope.page);

            };


            $scope.filterLists =  function() {
                return function(item) {


                    if ($scope.collectionTag.val && item.brandTag!=$scope.collectionTag.val){
                        return false;
                    }
                    if (!$scope.filtersList || $scope.filtersList.length<=0){
                        return true;
                    }
                     for (var i=0 ; i<=$scope.filtersList.length - 1; i++) {
                            if ($scope.filtersList[i].value && item.tags.indexOf($scope.filtersList[i].value)<=-1){
                                return false;
                            }
                     }
                    return true;
                }
            }
            /*$scope.filterLists1 =  function() {
                return function(item) {
                    //angular.isObject(item.filters)
                    //console.log(angular.isObject(item.filters));
                    if (!angular.isObject(item.filters ) && typeof(item.filters)=='string'){
                        item.filters=JSON.parse(item.filters);
                    }
                    //$timeout(function(){
                    if (!$scope.filtersList || $scope.filtersList.length<=0){
                        //console.log($scope.filtersList.length);
                        return true;
                    }
                    if (!item.filters || item.filters.length<=0){
                        return true;
                    }
                    for (var i=0 ; i<=$scope.filtersList.length - 1; i++) {
                        *//*console.log($scope.filtersList[i]);
                         console.log(item.filters[$scope.filtersList[i]._id]);*//*
                        if ($scope.filtersList[i].type=='1'){
                            if ($scope.filtersList[i].value && $scope.filtersList[i].value!=item.filters[$scope.filtersList[i]._id]){
                                return false;
                            }
                        } else {
                            *//*console.log($scope.filtersList[i].value);//item.filters[$scope.filtersList[i]._id]
                             console.log($scope.filtersList[i]._id);*//*
                            if ($scope.filtersList[i].value && item.filters[$scope.filtersList[i]._id][$scope.filtersList[i].value]=='NO'){
                                return false;
                            }
                        }
                    }
                    //console.log(item);
                    return true;
                    //},100)
                }
            }*/

            $scope.$watch('changeStuff',function(){
                if ($rootScope.changeStuff && $rootScope.$state.current.name=='mainFrame.stuff'){

                    console.log($rootScope.$state.current);
                    //$scope.getStuffList($scope.activeCategory,$scope.activeBrand);
                    $scope.loadData($scope.page);
                   /*for (var i=1;i<=$scope.page;i++){
                       promises.push($scope.getStuffList($scope.activeCategory,$scope.activeBrand,i));
                   }*/
                   //$q.all(promises);

                }
                $rootScope.changeStuff=false;
            })

            $scope.editStuffGallery = function(stuff){
                //$scope.stuffForGallery=stuff;
                $rootScope.$state.transitionTo('mainFrame.stuff.editStuffGallery',{id:stuff._id})
            }
            $scope.commentStuff = function(stuff){
                //$scope.stuffForGallery=stuff;
                $rootScope.$state.transitionTo('mainFrame.stuff.commentStuff',{id:stuff._id})
            }

        }])

    .controller('newsCtrl', ['$scope','$rootScope','News','$q','$timeout',
        function ($scope,$rootScope,News,$q,$timeout) {


            $scope.stuffList=[];
            //paginator
            $scope.page=1;
            //$scope.numPages=2;
            $scope.totalItems=0;
            //$scope.maxSize = 5;
            //$scope.perPage =3;
            var defer = $q.defer();
            var promises = [];




            $scope.getNewsList = function(page){
                if (!page){
                    $scope.page=1;
                    $scope.newsList=[];
                }

                News.list({page:$scope.page},function(tempArr){
                    console.log('sss');
                    if ($scope.page==1 && tempArr.length>0){
                        $scope.totalItems=tempArr[0].index;
                    }
                    for (var i=0 ; i<=tempArr.length - 1; i++) {
                        // tempArr[i].filters=JSON.parse(tempArr[i].filters);
                        $scope.newsList.push(tempArr[i]);
                    }
                });
            }
            //Angularjs promise chain when working with a paginated collection
            //http://stackoverflow.com/questions/20171928/angularjs-promise-chain-when-working-with-a-paginated-collection
            $scope.loadData = function(numPage) {
                //console.log(numPage);
                if (!numPage) numPage=1;
                var deferred = $q.defer();
                var i=1;
                $scope.newsList=[];
                function loadAll() {
                    News.list({page:i},function(news){
                        //console.log(stuffs);
                        if ($scope.newsList.length<=0 && news.length>0){
                            $scope.totalItems=news[0].index;
                        }
                        for(var ii=0; ii<=news.length-1;ii++){
                            $scope.newsList.push(news[ii]);
                        }
                        if(i<numPage) {
                            i++;
                            loadAll();
                        }
                        else {
                            deferred.resolve();
                        }
                    })
                }
                loadAll();
                return deferred.promise;
            };




            $scope.editNews = function(news){
                //console.log('dd');
                var id =(news)?news._id:'';
                $rootScope.$state.transitionTo('mainFrame.news.edit',{'id':id});

            }

            $scope.deleteNews = function(news){
                if (confirm("Удалить?")){
                    news.$delete(function(err){
                        if (err) console.log(err);
                        $rootScope.changeNews=true;
                        //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                    });
                }
            }

            $scope.setPage = function () {
                $scope.page++;
                $scope.getNewsList($scope.page);
                //console.log($scope.page);

            };



            $scope.$watch('changeNews',function(){
                if ($rootScope.changeNews){
                    //console.log('ssss');
                    $scope.loadData($scope.page);
                }
                $rootScope.changeNews=false;
            })

            $scope.editNewsGallery = function(news){
                //$scope.stuffForGallery=stuff;
                $rootScope.$state.transitionTo('mainFrame.news.editNewsGallery',{id:news._id})
            }

            $scope.getNewsList();
        }])




    .controller('editNewsCtrl', ['$scope','$rootScope','News','$timeout','$fileUpload',
        function ($scope,$rootScope,News,$timeout,$fileUpload) {
            $scope.focusInput=[];
            $scope.focusInput[0]=true;
            $scope.stuff={};
            $scope.stuff.name={"ru":'',"ua":'',"en":''};
            $scope.stuff.desc={"ru":'',"ua":'',"en":''};


            if ($rootScope.$stateParams.id){
                $scope.stuff=News.get($rootScope.$stateParams,function(res){
                    $scope.noChange=false;
                    $scope.myFileSrc=res.img;
                });

            } else {
                $scope.stuff={};
                $scope.stuff.name={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc0={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc1={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc2={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc3={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc4={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc5={"ru":'',"ua":'',"en":''};
                $scope.stuff.index=1;
                $scope.stuff.author=$rootScope.user._id;
            }


            $scope.afterSaveStuff = function(){
                $rootScope.$state.transitionTo('mainFrame.news');
                $rootScope.changeNews=true;

            }

            $scope.updateNews= function(stuff){
                if (!$scope.stuff._id){
                    News.add($scope.stuff,function(){
                        $scope.afterSaveStuff();
                    })
                } else{
                    $scope.stuff.$update(function(err){
                        $scope.afterSaveStuff();
                    });
                }
            }

            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/newsfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.stuff._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    //$scope.categories= Category.list();
                });
            };
        }])


    .controller('editNewsGalleryCtrl', ['$scope','$rootScope','$fileUpload','$http','News',"$timeout",
        function ($scope,$rootScope,$fileUpload,$http,News,$timeout) {


            $scope.Gallery = [];
            $scope.news= News.get({id:$rootScope.$stateParams.id},function(res){
                //console.log($scope.stuff);
                $scope.Gallery=res.gallery;

            });

            $scope.refreshNews= function(){
                var current = $rootScope.$state.current;
                var params = angular.copy($rootScope.$stateParams);
                $rootScope.$state.transitionTo(current, params, { reload: true, inherit: true, notify: true });
            }

            //console.log($scope.stuffForGallery);
            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=false;
            $scope.myFileSrc='/' + '?' + new Date().getTime();;
            $scope.uploadFile = function(){
                //console.log();
                if ($scope.Gallery.length>10) return;
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "api/newsfile/fileUploadGallery";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.news._id).then(function(promise){
                    $scope.refreshNews();
                });
            };

            $scope.deletePhoto = function(index){
                //var par = {'id':params.id,'photo':index};
                //console.log(index);
                if (confirm("Удалить?")){
                    $http.get("/api/newsfile/fileGalleryDelete/"+$scope.news._id+'/'+index).then(function (response) {
                        $scope.refreshNews();
                    });
                }
            }

            /*$scope.updateNewsGallery = function(){
                $scope.saveDisabled=true;
                $scope.gallery=[];
                $timeout(function(){
                    $scope.news.$updateGallery(function(news){
                        // stuff;
                        $scope.refreshNews();
                    });
                },200);

            }*/


            $scope.backToList=function(){
                $rootScope.$state.transitionTo('mainFrame.news');
                $rootScope.changeNews=true;
            }



        }])

    .controller('editStuffCtrl', ['$scope','Brands','$rootScope','Category','Filters','Stuff','$timeout','$fileUpload','BrandTags',
        function ($scope,Brands,$rootScope,Category,Filters,Stuff,$timeout,$fileUpload,BrandTags) {
            $scope.focusInput=[];
            $scope.focusInput[0]=true;
            $scope.filterListEdit=[];
            $scope.stuff={};
            $scope.stuff.name={"ru":'',"ua":'',"en":''};
            $scope.stuff.desc={"ru":'',"ua":'',"en":''};
            $scope.stuff.category='';
            $scope.stuff.tags=[];
            $scope.filtersValue={};
            $scope.brandTags=[];
            $scope.brandTag='';
            $scope.stock={};
            $scope.sizeId,$scope.colorId;
            $scope.sizeName={};
            $scope.colorName={};

            if ($rootScope.$stateParams.id){
                $timeout(function(){
                    $scope.stuff=Stuff.get($rootScope.$stateParams,function(res){
                        $scope.noChange=false;
                        $scope.myFileSrc=$scope.stuff.img;
                        if (res.stock){
                            res.stock=JSON.parse(res.stock);
                        }
                        console.log(res.stock);
                    });
                },400);
            } else {
                $timeout(function(){
                    $scope.stuff.category=($scope.activeCategory)?$scope.activeCategory:$scope.categoryList[0]._id;
                    $scope.stuff.brand=($scope.activeBrand)?$scope.activeBrand:$scope.brandList[0]._id;
                },400);
            }

            $scope.$watch('stuff.category',function(){
                if (!$scope.stuff.category) return;
                $scope.getFilters($scope.stuff.category,$scope.setFilterValue);
            });

            $scope.getFilters = function(id,cb){
                Category.get({_id:$scope.stuff.category},function(category){
                    //console.log(category)
                    $scope.filterListEdit=Filters.list({'filters':JSON.stringify(category.filters)},function(res){
                        //console.log($scope.filterListEdit);
                        cb($scope.stuff.tags);

                        //console.log($scope.colorId+'   '+$scope.sizeId);
                    });
                });

            }

            $scope.$watch('stuff.brand',function(){
                if ($scope.stuff.brand){
                    $scope.brandTags=BrandTags.list({brand:$scope.stuff.brand},function(){
                        $scope.brandTag='';
                    });
                } else {
                    $scope.stuff.brandTag=null;
                }
            });
            function setStock(){
                $scope.stock={};
                if($scope.filtersValue[$scope.colorId] && $scope.filtersValue[$scope.colorId].length){
                    for (var i=0 ; i<$scope.filtersValue[$scope.colorId].length; i++) {
                        $scope.stock[$scope.filtersValue[$scope.colorId][i]]={};
                        if($scope.filtersValue[$scope.sizeId] && $scope.filtersValue[$scope.sizeId].length){
                            for (var j=0 ; j<$scope.filtersValue[$scope.sizeId].length; j++) {
                                if ($scope.stuff.stock
                                    &&$scope.stuff.stock[$scope.filtersValue[$scope.colorId][i]]/*
                                    &&$scope.stuff.stock[$scope.filtersValue[$scope.colorId][i]][$scope.filtersValue[$scope.sizeId][j]]*/){
                                    $scope.stock[$scope.filtersValue[$scope.colorId][i]]
                                        [$scope.filtersValue[$scope.sizeId][j]]=
                                        $scope.stuff.stock[$scope.filtersValue[$scope.colorId][i]][$scope.filtersValue[$scope.sizeId][j]];
                                } else {
                                    $scope.stock[$scope.filtersValue[$scope.colorId][i]]
                                        [$scope.filtersValue[$scope.sizeId][j]]=0;
                                }
                            }
                        }
                    }
                }
            }
            $scope.setFilterValue= function(tags){
                for (var i=0 ; i<=$scope.filterListEdit.length - 1; i++) {
                        if($scope.filterListEdit[i].name['en'].toLowerCase()=='color'){
                            $scope.colorId=$scope.filterListEdit[i]._id;
                            $scope.filterListEdit[i].tags.forEach(function(el){
                                $scope.colorName[el._id]=el.name[$rootScope.config.DL];
                            })
                        }
                        if($scope.filterListEdit[i].name['en'].toLowerCase()=='size'){
                            $scope.sizeId=$scope.filterListEdit[i]._id;
                            $scope.filterListEdit[i].tags.forEach(function(el){
                                $scope.sizeName[el._id] = el.name[$rootScope.config.DL];
                            })
                        }
                    if ($scope.filterListEdit[i].type=='1'){
                        var found = false;
                        $scope.filterListEdit[i].tags.forEach(function(el){
                            if (tags.indexOf(el._id) > -1){
                                $scope.filtersValue[$scope.filterListEdit[i]._id]=el._id;
                                found = true;
                            }
                        })
                        if (!found) $scope.filtersValue[$scope.filterListEdit[i]._id]='';
                        //alert('ddddd');
                    } else {
                        $scope.filtersValue[$scope.filterListEdit[i]._id]=[];
                        $scope.filterListEdit[i].tags.forEach(function(el){
                            if (tags.indexOf(el._id) > -1){
                                $scope.filtersValue[$scope.filterListEdit[i]._id].push(el._id);
                            }
                        })
                    }
                    //****************************наличие
                    $timeout(function(){setStock();},200);
                    //*********************************************
                   // console.log( $scope.stock);

                }
            }
            $scope.changeStock = function(key,key1){
                $scope.stock[key][key1]=($scope.stock[key][key1]>0)?0:1;
            }
            $scope.changeFitlerVal = function(){
                console.log('ss');
                $timeout(function(){setStock()},200);
            }


            $scope.afterSaveStuff = function(){
                $rootScope.$state.transitionTo('mainFrame.stuff');
                $rootScope.changeStuff=true;

            }


            function setFiltersTags(filtersValue){
                $scope.stuff.tags=[];
                for( var i in filtersValue){
                    if( angular.isArray(filtersValue[i]) && (filtersValue[i] !== null) ){
                        for (var j=0; j< filtersValue[i].length;j++) {
                                $scope.stuff.tags.push(filtersValue[i][j]);
                        }
                    } else{
                        if (filtersValue[i]){
                            $scope.stuff.tags.push(filtersValue[i]);
                        }
                    }
                }
                $scope.stuff.stock=JSON.stringify($scope.stock);
            }


            $scope.updateStuff= function(stuff){
                setFiltersTags($scope.filtersValue);
                var i;
                for(i=0; i<=$rootScope.config.langArr.length-1;i++){
                    $scope.stuff.name[$rootScope.config.langArr[i]]=$scope.stuff.name[$rootScope.config.langArr[i]].substring(0,30);
                }
                for(i=0;i<=$rootScope.config.langArr.length-1;i++){
                    $scope.stuff.desc[$rootScope.config.langArr[i]]=$scope.stuff.desc[$rootScope.config.langArr[i]].substring(0,3000);
                }
                if (!$scope.stuff._id){
                    Stuff.add($scope.stuff,function(){
                        $scope.afterSaveStuff();
                    })
                } else{
                    $scope.stuff.$update(function(err){
                        $scope.afterSaveStuff();
                    });
                }
            }

            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/stufffile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.stuff._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    //$scope.categories= Category.list();
                });
            };
       }])


    .controller('commentStuffCtrl', ['$scope','$rootScope','Stuff',"Comment",
        function ($scope,$rootScope,Stuff,Comment) {
            $scope.disallowEdit = true;
            $scope.stuff=Stuff.full({id:$rootScope.$stateParams,page:'page'});
            $scope.comment={};

            $scope.backToList=function(){
                $rootScope.$state.transitionTo('mainFrame.stuff');
                $rootScope.changeStuff=true;
            }

            $scope.editComment = function(comment){
                //console.log($rootScope.user);
                $scope.disallowEdit = false;
                if (!comment){
                    $scope.comment={};
                    $scope.comment.text='';

                    $scope.comment.author=$rootScope.user._id;
                    $scope.comment.authorName=$rootScope.user.name;
                    $scope.comment.stuff=$rootScope.$stateParams.id;

                } else {
                    $scope.comment = Comment.get(comment,function(){
                        console.log($scope.comment);
                        $scope.comment.authorName=$scope.comment.author.name;
                    });
                }


            }

            $scope.afterSave = function(){
                $scope.comment.text='';
                $scope.comment.author='';
                $scope.comment.date='';
                $scope.stuff=Stuff.full({id:$rootScope.$stateParams,page:'page'});
            }

            $scope.updateComment =  function(){
                $scope.disallowEdit = true;

                if (!$scope.comment._id){
                    Comment.add($scope.comment,function(){
                        $scope.afterSave();
                    })
                } else{
                    $scope.comment.$update(function(err){
                        $scope.afterSave();
                    });

                }
            }

            $scope.deleteComment = function(comment){
                if (confirm("Удалить?")){
                    $scope.comment = Comment.get(comment,function(){
                        $scope.comment.$delete(function(err){
                            if (err) console.log(err);
                            $scope.afterSave();
                            //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                        });
                    });

                }
            }

            $scope.dateConvert = function(date){
                return moment(date).format('lll');
            }


        }])


    .controller('editStuffGalleryCtrl', ['$scope','$rootScope','$fileUpload','$http','Stuff',"$timeout",
        function ($scope,$rootScope,$fileUpload,$http,Stuff,$timeout) {

            $scope.photoIndexArray=[1,2,3,4,5,6,7,8,9,10,11,12];
            $scope.photoIndex=1;
            $scope.mainFilterTag='';
            $scope.gallery = [];//= $scope.stuffForGallery.gallery;
            $scope.stuff= Stuff.full({id:$rootScope.$stateParams.id,page:'page'},function(){
                //console.log($scope.stuff);
                $scope.gallery=$scope.stuff.gallery;

            });

            $scope.refreshStuff= function(){
                var current = $rootScope.$state.current;
                var params = angular.copy($rootScope.$stateParams);
                $rootScope.$state.transitionTo(current, params, { reload: true, inherit: true, notify: true });
                /*
                                $scope.stuff= Stuff.full({id:$rootScope.$stateParams.id},function(){
                                    $scope.gallery=$scope.stuff.gallery;
                                    $scope.myFileSrc='/' + '?' + new Date().getTime();
                                    $scope.noChange=false;
                                    $scope.photoIndex=1;
                                    $scope.mainFilterTag='';
                                    $scope.saveDisabled=false;
                                });*/
            }
            //console.log($scope.stuffForGallery);
            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=false;
            $scope.myFileSrc='/' + '?' + new Date().getTime();;
            $scope.uploadFile = function(){
                if ($scope.gallery.length>=12) return;
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "api/stufffile/fileUploadGallery";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.stuff._id,{index:$scope.photoIndex,tag:$scope.mainFilterTag}).then(function(promise){
                    $scope.refreshStuff();
                });
            };

            $scope.deletePhoto = function(index){
                //var par = {'id':params.id,'photo':index};
                //console.log(index);
                if (confirm("Удалить?")){
                    $http.get("/api/stufffile/fileGalleryDelete/"+$scope.stuff._id+'/'+index).then(function (response) {
                        $scope.refreshStuff();
                    });
                }
            }

            $scope.updateStuffGallery = function(){
                $scope.saveDisabled=true;
                $scope.gallery=[];
                $timeout(function(){
                    $scope.stuff.$updateGallery(function(stuff){
                        // stuff;
                        $scope.refreshStuff();
                    });
                },200);

            }


            $scope.backToList=function(){
                $rootScope.$state.transitionTo('mainFrame.stuff');
                $rootScope.changeStuff=true;
            }



        }])


    .controller('collectionCtrl', ['$scope','Brands','$rootScope','BrandTags',
        function ($scope,Brands,$rootScope,BrandTags) {
            $rootScope.activeBrand=null;
            $scope.brands= Brands.list();


            $scope.editCollection= function(collection){
                var id =(collection)?collection._id:'';
                $rootScope.$state.transitionTo('mainFrame.collection.edit',{'brand':$scope.activeBrand._id,'id':id});
            }


            $scope.deleteCollection = function(brand){
                if (confirm("Удалить?")){
                    brand.$delete(function(err){
                        if (err) console.log(err);
                        $scope.brands= Brands.list();
                    });
                }
            }

            $scope.$watch('activeBrand',function(){
                if ($scope.activeBrand){
                    $scope.collections= BrandTags.list({brand:$scope.activeBrand._id});
                }
            })

            $scope.selectBrand= function(Brand){
                $scope.activeBrand=Brand;
            }


            $scope.$watch('changeCollection',function(){
                //console.log($rootScope.changeCollection);
                if ($rootScope.changeCollection){
                    //console.log($scope.activeBrand);
                    if ($scope.activeBrand){
                        $scope.collections= BrandTags.list({brand:$scope.activeBrand._id});
                    }
                }
                $rootScope.changeCollection=false;
            })
        }])

    .controller('editCollectionCtrl', ['$scope','$rootScope','$fileUpload','$timeout','BrandTags',
        function ($scope,$rootScope,$fileUpload,$timeout,BrandTags) {
            //$scope.categories =Category.list();
            $scope.focusInput=[];
            $scope.showThumb=true;

            $scope.editBrandTag= function(){
                $scope.focusInput[0]=true;
                if (!$rootScope.$stateParams.id){
                    $scope.brandTag={};
                    $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                    $scope.brandTag.desc={"ru":'',"ua":'',"en":''};
                    $scope.brandTag.index=1;
                } else {
                    $scope.brandTag=BrandTags.get({id:$rootScope.$stateParams.id},function(){
                        $scope.noChange=false;
                        if ($scope.brandTag.img)
                            $scope.myFileSrc=$scope.brandTag.img;
                    });
                }
            }

            $scope.afterSave=function(){
                $rootScope.$state.transitionTo('mainFrame.collection');
                $rootScope.changeCollection=true;
            }

            $scope.updateCollection= function(){
               if (!$scope.brandTag._id){
                    $scope.brandTag.brand=$rootScope.$stateParams.brand;
                    BrandTags.add($scope.brandTag,function(){
                        $scope.afterSave();
                    })
                } else{
                    $scope.brandTag.$update(function(err){
                        $scope.afterSave();
                    });
                }

            }
            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/collectionfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.brandTag._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    //$scope.brands= Brand.list();
                });
            };

            $scope.editBrandTag();

    }])

    .controller('placesCtrl', ['$scope','$rootScope','Country','Region','City',
        function ($scope,$rootScope,Country,Region,City) {
            $scope.editDisabledC=true;
            $scope.editDisabledR=true;
            $scope.editDisabledCity=true;
            //$scope.conf=$rootScope.config;
            $scope.focusInput=[];
            $scope.focusInputR=[];
            $scope.focusInputC=[];
            $scope.activeCounty={};
            $scope.activeRegion={};
            $scope.activeCity={};
            $scope.country={};
            $scope.region={};
            $scope.city={};

            function getCountries(){
                $scope.countries=Country.list(function(){
                    if (!$scope.activeCountryl && $scope.countries.length>0 ){
                        $scope.activeCountry=$scope.countries[0];
                    } else {
                        if ($scope.activeCountry){
                            for(var i=0;i<=$scope.countries.length-1;i++){
                                if ($scope.countries[i]._id==$scope.activeCountry._id){
                                    $scope.activeCountry = JSON.parse(JSON.stringify($scope.countries[i]));
                                    break;
                                }
                            }
                        }
                    }
                });
            }
            getCountries();

            $scope.editCountry = function(country,edit){
                if (edit)
                    $scope.editDisabledC=false;
                else
                    $scope.editDisabledC=true;
                if (!country){
                    $scope.activeCountry={};
                    $scope.country={};
                    $scope.country.name={"ru":'',"ua":'',"en":''};
                    $scope.country.index=1;
                }
                else {
                    $scope.country=country;
                    $scope.activeCountry=JSON.parse(JSON.stringify($scope.country));
                }
            }

            $scope.saveCountry = function(){
                function afterSave(){
                    $scope.country.name={"ru":'',"ua":'',"en":''};
                    $scope.country.index=1;
                    getCountries();
                    $scope.editDisabledC=true;
                }
                if (!$scope.country._id){
                    Country.add($scope.country,function(){
                        afterSave()
                    })
                } else{
                    $scope.country.$update(function(err){
                        if (err) console.log(err);
                        afterSave()
                    });
                }
            }
            $scope.deleteCountry = function(country){
                if (confirm("Удалить?")){
                    if (country._id == $scope.activeCountry._id){
                        $scope.activeCountry= {};
                    }
                    country.$delete(function(err,res){
                        console.log(err);
                        console.log(res);
                        getCountries()
                    });
                }
            }

            $scope.$watch('activeCountry',function(){
                var country =($scope.activeCountry)?$scope.activeCountry._id:'';
                getRegions(country,true);
            })

            /// region  ***************************
            function getRegions(country,newActiveRegion){
                $scope.regions=[];
                //alert($scope.activeRegion._id);
                //$scope.activeRegion={};
                $scope.region={};
                if (!country) return;
                $scope.regions=Region.list({country:country},function(){
                    if (newActiveRegion){
                        if($scope.regions.length>0 )
                            $scope.activeRegion=JSON.parse(JSON.stringify($scope.regions[0]));
                        else
                            $scope.activeRegion={};
                    } else {
                        //alert('ss');
                            for(var i=0;i<=$scope.regions.length-1;i++){
                                if ($scope.regions[i]._id==$scope.activeRegion._id){
                                    $scope.activeRegion = JSON.parse(JSON.stringify($scope.regions[i]));
                                    break;
                                }
                            }
                  }
                });
            }


            $scope.editRegion = function(region,edit){

                if (edit)
                    $scope.editDisabledR=false;
                else
                    $scope.editDisabledR=true;
                if (!region){
                    $scope.activeRegion={};
                    $scope.region={};
                    $scope.region.country=$scope.activeCountry._id;
                    $scope.region.name={"ru":'',"ua":'',"en":''};
                    $scope.region.index=1;
                }
                else {
                    $scope.region=region;
                    $scope.activeRegion = JSON.parse(JSON.stringify($scope.region));
                }
            }

            $scope.saveRegion = function(){
                function afterSave(){
                    $scope.region.name={"ru":'',"ua":'',"en":''};
                    $scope.region.index=1;
                    getRegions($scope.activeCountry._id);
                    $scope.editDisabledR=true;
                }
                if (!$scope.region._id){
                    Region.add($scope.region,function(){
                        afterSave()
                    })
                } else{
                    $scope.region.$update(function(err){
                        if (err) console.log(err);
                        afterSave()
                    });
                }
            }
            $scope.deleteRegion = function(region){
                if (confirm("Удалить?")){
                    if (region._id == $scope.activeRegion._id){
                        $scope.activeRegion= {};
                    }
                    region.$delete(function(err,res){
                        console.log(err);
                        console.log(res);
                        getRegions($scope.activeCountry._id);
                    });
                }s
            }


            $scope.$watch('activeRegion',function(){
                var region =($scope.activeRegion)?$scope.activeRegion._id:'';
                getCities(region,true);
            })

            // города *********************************
            function getCities(region,newActiveCity){
                $scope.cities=[];
                //alert($scope.activeRegion._id);
                //$scope.activeRegion={};
                $scope.city={};
                if (!region) return;
                $scope.cities=City.list({region:region},function(){
                    if (newActiveCity){
                        if($scope.cities.length>0)
                            $scope.activeCity=JSON.parse(JSON.stringify($scope.cities[0]));
                        else
                            $scope.activeCity={};
                    } else {
                        //alert('ss');
                        for(var i=0;i<=$scope.cities.length-1;i++){
                            if ($scope.cities[i]._id==$scope.activeCity._id){
                                $scope.activeCity = JSON.parse(JSON.stringify($scope.cities[i]));
                                break;
                            }
                        }
                    }
                });
            }


            $scope.editCity = function(city,edit){

                if (edit)
                    $scope.editDisabledCity=false;
                else
                    $scope.editDisabledCity=true;
                if (!city){
                    $scope.activeCity={};
                    $scope.city={};
                    $scope.city.country=$scope.activeCountry._id;
                    $scope.city.region=$scope.activeRegion._id;
                    $scope.city.name={"ru":'',"ua":'',"en":''};
                    $scope.city.index=1;
                }
                else {
                    $scope.city=city;
                    $scope.activeCity = JSON.parse(JSON.stringify($scope.city));
                }
            }

            $scope.saveCity = function(){
                function afterSave(){
                    $scope.city.name={"ru":'',"ua":'',"en":''};
                    $scope.city.index=1;
                    getCities($scope.activeRegion._id);
                    $scope.editDisabledCity=true;
                }
                if (!$scope.city._id){
                    City.add($scope.city,function(){
                        afterSave()
                    })
                } else{
                    $scope.city.$update(function(err){
                        if (err) console.log(err);
                        afterSave()
                    });
                }
            }
            $scope.deleteCity = function(city){
                if (confirm("Удалить?")){
                    if (city._id == $scope.activeCity._id){
                        $scope.activeCity= {};
                    }
                    city.$delete(function(err,res){
                        console.log(err);
                        console.log(res);
                        getCities($scope.activeRegion._id);
                    });
                }s
            }

        }])
    .controller('currencyCtrl', ['$scope','Config','$timeout',
        function ($scope,Config,$timeout) {
            //Currency
            //.success(function(data) {console.log(data)})
            $scope.disabledButton=true;
            $scope.showMessage=false;
            $scope.config =  Config.get(function(data){
                if (data.error) {console.log(data.error); $scope.config={currency:{'EUR':{},"USD":{}},parse:{}}}
                console.log($scope.config);$scope.disabledButton=false;});
            $scope.updateCurrency= function(){
                $scope.config.currency['EUR'][0]=parseFloat($scope.config.currency['EUR'][0]);
                $scope.config.currency['USD'][0]=parseFloat($scope.config.currency['USD'][0]);
                $scope.config.parse['az']=   parseFloat($scope.config.parse['az']);
                $scope.config.parse['scars']=parseFloat($scope.config.parse['scars']);
                $scope.disabledButton=true;

                Config.save($scope.config,function() {
                   $scope.showMessage=true;
                    $timeout(function(){$scope.showMessage=false;$scope.disabledButton=false;},3000);
                });
            }
            //console.log($scope.currency);

        }])


.controller('ordersCtrl', ['$scope','$rootScope','Orders',
    function ($scope,$rootScope,Orders) {
        //var start = Date.now();
        //console.log(start)
        $scope.filterStatus='';
        $scope.orders=Orders.list();



        $scope.afterSave = function(){
            $scope.orders=Orders.list();
        };

        $scope.updateOrder =  function(order){

            order.$update(function(err){
                if (err) console.log(err);
                $scope.afterSave();
                /*$location.hash(id);
                $anchorScroll();*/
            });
        }
        /*$scope.cartCount =  function(cartItems){
            var i=0;
            cartItems.forEach(function(item){
                //console.log(item.quantity);
                if(item.quantity)
                    i +=Number(item.quantity);
            })
            return i;

        }
        $scope.getTotalSum =  function(order){

        }*/



        $scope.deleteOrder = function(order){
            if (confirm("Удалить?")){
                order.$delete(function(err){
                    if (err) console.log(err);
                    $scope.afterSave();
                    //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                });
                /*Orders.get({'id':order._id},function(order){
                    order.$delete(function(err){
                        if (err) console.log(err);
                        $scope.afterSave();
                        //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                    });
                });
*/
            }
        }

        $scope.dateConvert = function(date){
            if (date) {
                return moment(date).format('lll');
            } else {
                return '';
            }

        }


    }])


    .controller('usersCtrl', ['$scope','$rootScope','User',
        function ($scope,$rootScope,User) {

            $scope.users=User.list();
            $scope.afterSave = function(){
                $scope.users=User.list();
            };
            $scope.updateUser =  function(user){
                //console.log(user);
                user.$update(function(err){
                    if (err) console.log(err);
                    $scope.afterSave();
                });
            }
            $scope.deleteUser = function(order){
                if (confirm("Удалить?")){
                    user.$delete(function(err){
                        if (err) console.log(err);
                        $scope.afterSave();
                    });
                }
            }
        }])


    .controller('statCtrl', ['$scope','$rootScope','Stat','$q','$timeout',
        function ($scope,$rootScope,Stat,$q,$timeout) {


            $scope.statList=[];
            //paginator
            $scope.page=1;
            //$scope.numPages=2;
            $scope.totalItems=0;
            //$scope.maxSize = 5;
            //$scope.perPage =3;
            var defer = $q.defer();
            var promises = [];




            $scope.getStatList = function(page){
                if (!page){
                    $scope.page=1;
                    $scope.statList=[];
                }

                Stat.list({page:$scope.page},function(tempArr){
                    if ($scope.page==1 && tempArr.length>0){
                        $scope.totalItems=tempArr[0].index;
                    }
                    for (var i=0 ; i<=tempArr.length - 1; i++) {
                        // tempArr[i].filters=JSON.parse(tempArr[i].filters);
                        $scope.statList.push(tempArr[i]);
                    }
                });
            }
            //Angularjs promise chain when working with a paginated collection
            //http://stackoverflow.com/questions/20171928/angularjs-promise-chain-when-working-with-a-paginated-collection
            $scope.loadData = function(numPage) {
                //console.log(numPage);
                if (!numPage) numPage=1;
                var deferred = $q.defer();
                var i=1;
                $scope.statList=[];
                function loadAll() {
                    Stat.list({page:i},function(stat){
                        //console.log(stuffs);
                        if ($scope.statList.length<=0 && stat.length>0){
                            $scope.totalItems=stat[0].index;
                        }
                        for(var ii=0; ii<=stat.length-1;ii++){
                            $scope.statList.push(stat[ii]);
                        }
                        if(i<numPage) {
                            i++;
                            loadAll();
                        }
                        else {
                            deferred.resolve();
                        }
                    })
                }
                loadAll();
                return deferred.promise;
            };




            $scope.editStat = function(stat){
                //console.log('dd');
                var id =(stat)?stat._id:'';
                $rootScope.$state.transitionTo('mainFrame.stat.edit',{'id':id});

            }

            $scope.deleteStat = function(stat){
                if (confirm("Удалить?")){
                    stat.$delete(function(err){
                        if (err) console.log(err);
                        $rootScope.changeStat=true;
                        //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                    });
                }
            }

            $scope.setPage = function () {
                $scope.page++;
                $scope.getStatList($scope.page);
                //console.log($scope.page);

            };



            $scope.$watch('changeStat',function(){
                if ($rootScope.changeStat){
                    $scope.loadData($scope.page);
                }
                $rootScope.changeStat=false;
            })

            $scope.editStatGallery = function(stat){
                //$scope.stuffForGallery=stuff;
                $rootScope.$state.transitionTo('mainFrame.stat.editStatGallery',{id:stat._id})
            }

            $scope.getStatList();
        }])




    .controller('editStatCtrl', ['$scope','$rootScope','Stat','$timeout','$fileUpload',
        function ($scope,$rootScope,Stat,$timeout,$fileUpload) {
            $scope.focusInput=true;
            /*$scope.stuff={};
            $scope.stuff.name={"ru":'',"ua":'',"en":''};
            $scope.stuff.desc={"ru":'',"ua":'',"en":''};*/


            if ($rootScope.$stateParams.id){
                $scope.stuff=Stat.get($rootScope.$stateParams,function(res){
                    $scope.noChange=false;
                    $scope.myFileSrc=res.img;
                });

            } else {
                $scope.stuff={};
                $scope.stuff.name='';
                $scope.stuff.desc0={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc1={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc2={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc3={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc4={"ru":'',"ua":'',"en":''};
                $scope.stuff.desc5={"ru":'',"ua":'',"en":''};
            }


            $scope.afterSaveStuff = function(){
                $rootScope.$state.transitionTo('mainFrame.stat');
                $rootScope.changeStat=true;

            }

            $scope.updateStat= function(stuff){
                if (!$scope.stuff._id){
                    Stat.add($scope.stuff,function(){
                        $scope.afterSaveStuff();
                    })
                } else{
                    $scope.stuff.$update(function(err){
                        $scope.afterSaveStuff();
                    });
                }
            }

            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/statfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.stuff._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    //$scope.categories= Category.list();
                });
            };
        }])


    .controller('editStatGalleryCtrl', ['$scope','$rootScope','$fileUpload','$http','Stat',
        function ($scope,$rootScope,$fileUpload,$http,Stat) {


            $scope.Gallery = [];
            $scope.stat= Stat.get({id:$rootScope.$stateParams.id},function(res){
                //console.log($scope.stuff);
                $scope.Gallery=res.gallery;

            });

            $scope.refreshStat= function(){
                var current = $rootScope.$state.current;
                var params = angular.copy($rootScope.$stateParams);
                $rootScope.$state.transitionTo(current, params, { reload: true, inherit: true, notify: true });
            }

            //console.log($scope.stuffForGallery);
            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=false;
            $scope.myFileSrc='/' + '?' + new Date().getTime();;
            $scope.uploadFile = function(){
                //console.log();
                if ($scope.Gallery.length>5) return;
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "api/statfile/fileUploadGallery";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.stat._id).then(function(promise){
                    $scope.refreshStat();
                });
            };

            $scope.deletePhoto = function(index){
                //var par = {'id':params.id,'photo':index};
                //console.log(index);
                if (confirm("Удалить?")){
                    $http.get("/api/statfile/fileGalleryDelete/"+$scope.stat._id+'/'+index).then(function (response) {
                        $scope.refreshStat();
                    });
                }
            }
         $scope.backToList=function(){
                $rootScope.$state.transitionTo('mainFrame.stat');
                $rootScope.changeStat=true;
            }



        }])


    .controller('importExelCtrl', ['$scope','$rootScope','$resource','$upload',function ($scope,$rootScope,$resource,$upload) {
        var Shippers= $resource('api/shipper/:id',{id:'@_id'});


        function afterChange(){
            $scope.shippers=Shippers.query();
            $scope.shipperName='';
            $scope.shipperCode='';
            $scope.shipperId='';
            $scope.shipperRatio=1;
            $scope.shipperRatioEnter=1;
            $scope.shipperCur='';
        }

        afterChange();
        $scope.deleteShipper=function(id){
            if (id) {
                for (var i= 0,l=$scope.shippers.length;i<l;i++){
                    if ($scope.shippers[i]._id==id){
                        $scope.shippers[i].$delete(function(){
                            afterChange()
                        });
                        break;
                    }
                }
            }
        }

        $scope.saveShipper=function(id){
            if (id) {
                for (var i= 0,l=$scope.shippers.length;i<l;i++){
                    if ($scope.shippers[i]._id==id){

                        $scope.shippers[i].name=$scope.shipperName;
                        $scope.shippers[i].code=$scope.shipperCode;
                        $scope.shippers[i].ratio=$scope.shipperRatio;
                        $scope.shippers[i].currency=$scope.shipperCur;
                        $scope.shippers[i].ratioEnter=$scope.shipperRatioEnter;
                        $scope.shippers[i].$save(function(){
                            afterChange()
                        });
                        break;
                    }
                }
            } else {
                if ($scope.shipperName){
                    /*$scope.shippers[$scope.shippers.length]={id:$scope.shippers.length,name:$scope.shipperName};
                    afterChange()*/
                    Shippers.save({name :$scope.shipperName,code:$scope.shipperCode,
                        ratio:$scope.shipperRatio,currency:$scope.shipperCur},function(){
                        afterChange()
                    })
                }
            }
        }

        $scope.$watch('shipperId',function(n,o){
            $scope.shipperName='';
            for (var i= 0,l=$scope.shippers.length;i<l;i++){
                if ($scope.shippers[i]._id==n){
                    $scope.shipperName=$scope.shippers[i].name;
                    $scope.shipperCode=$scope.shippers[i].code;
                    $scope.shipperRatio=$scope.shippers[i].ratio;
                    $scope.shipperRatioEnter=$scope.shippers[i].ratioEnter;
                    $scope.shipperCur=$scope.shippers[i].currency;
                    break;
                }
            }
        })

        $scope.onFileSelect = function($files) {

            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                $scope.sendFile=true;
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/api/shipper/upload/exel', //upload.php script, node.js route, or servlet url
                    //method: 'POST' or 'PUT',
                    //headers: {'header-key': 'header-value'},
                    //withCredentials: true,
                    data: {shipper: $scope.shipperId,code:$scope.shipperCode},
                    file: file // or list of files ($files) for html5 only
                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    // customize file formData name ('Content-Disposition'), server side file variable name.
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                    //formDataAppender: function(formData, key, val){}
                })
                    /*.progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    })
                    .success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        $scope.sendFile=false;
                        alert('загружен!!!')
                        console.log(data);
                    })
                    .error(function(data){
                        $scope.sendFile=false;
                        console.log(data);
                        alert(data)
                    })*/
                    .then(function(data, status, headers, config) {
                        // file is uploaded successfully
                        $scope.sendFile=false;
                        alert('загружен!!!')
                        console.log(data);
                    }, function(data){
                        $scope.sendFile=false;
                        //console.log(data);
                        alert(data.data.error)
                    }, function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                 });
                //.then(success, error, progress);
                // access or attach event listeners to the underlying XMLHttpRequest.
                //.xhr(function(xhr){xhr.upload.addEventListener(...)})
            }
            /* alternative way of uploading, send the file binary with the file's content-type.
             Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
             It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };


    }])


    .controller('customerListCtrl',['$scope','$rootScope','$resource','$uibModal',function($scope,$rootScope,$resource,$modal){
        var JobTicket = $resource('api/jobticket/:id',{id:'@_id'});
        var Convert = $resource('/api/jobticket/convert/:type',{type:'@type'});


        $rootScope.$watch('config.normaHour',function(n,o){
            if (n){
                $scope.normaHour=$rootScope.config.normaHour;
            }else{
                $scope.normaHour=200.00;
            }
        })
        $scope.$on('saved', function(event, data) {
            $scope.afterSave();
        });

        $scope.paginate={page:0,row:0,totalItems:0}
        $scope.$watch('paginate.row',function(n,o){
            if (!n) return;
            if ($scope.paginate.page>0){
                $scope.paginate.page=0;
            } else {
                $scope.afterSave();
            }

        });
        $scope.$watch('paginate.page',function(n,o){
            if ($scope.paginate.row==0){
                return;
            } else {
                $scope.afterSave();
            }
        });

//**********************************************************************************************
        // $scope.moment= moment;


        $scope.afterSave = function(){
            JobTicket.query({perPage:$scope.paginate.row , page:$scope.paginate.page},function(res){
                //console.log(res);
                if ($scope.paginate.page==0 && res.length>0){
                    $scope.paginate.totalItems=res.shift().index;
                }
                $scope.jobTickets=res;
                //console.log($scope.jobTickets);
            })
        }




        $scope.editJobTicket = function(jobTicket){
            //console.log('dd');
            var id =(jobTicket)?jobTicket._id:'';
            $rootScope.$state.transitionTo('mainFrame.customerList.custom',{'id':id});

        }
        /*$rootScope.$on('keypress', function (evt, obj, key) {
            $scope.$apply(function () {
                $scope.key = key;
                console.log(key)
            });
        })*/
       
        $scope.deleteJobTicket = function(jobTicket){
            var modalInstance = $modal.open({templateUrl: 'myModalContentD.html',controller: ModalInstanceCtrlD,size: 'sm'});

            modalInstance.result.then(function (pswd) {               
                if (pswd=='2911'){
                    jobTicket.$delete(function(err){
                        //if (err) console.log(err);
                        $scope.afterSave();
                    });                  
                }            
            }, function () {
              console.log('Modal dismissed at: ' +  Date.now());
            });
        }
        var ModalInstanceCtrlD = function ($scope, $uibModalInstance) {
           $scope.pswd = '2';         
          $scope.ok = function (pswd) {
            $uibModalInstance.close(pswd);
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }

        $scope.recalculateJobTicket = function(jobTicket){
            if (confirm("Уверен?")){
                Convert.get({type:'ticket',id:jobTicket._id},function(res){
                    $scope.afterSave();
                    alert(res.msg)
                });
            }
        }

        $scope.getTotalJobs = function(jobs){
            //console.log(jobs);
            var sum = 0;
            if (jobs && jobs.length){
                for(var i= 0,l=jobs.length;i<l;i++){
                    var j = jobs[i];
                    sum += j.sum || j.norma*j.q*$scope.getTypeRatio(j.jobType)*$scope.normaHour;
                }
            }
            //console.log(sum);
            return sum;
        }
        $scope.getTotalSparks = function(sparks){
            console.log(sparks);
            var sum = 0;
            if (sparks && sparks.length){
                for(var i= 0,l=sparks.length;i<l;i++){
                    sum +=sparks[i].price
                }
            }
            return sum
        }
        $scope.getTotalPay = function(pay){
            var sum = 0;
            if (pay && pay.length){
                for(var i= 0,l=pay.length;i<l;i++){
                    sum +=pay[i].val
                }
            }
            return sum
        }



    }])




    .controller('jobTicketArchCtrl',['$scope','$rootScope','$resource','$uibModal',function($scope,$rootScope,$resource,$modal){
        var JobTicketArch = $resource('api/jobticketarch/:id',{id:'@_id'});



        $scope.paginate={page:0,row:0,totalItems:0}
        $scope.$watch('paginate.row',function(n,o){
            if (!n) return;
            if ($scope.paginate.page>0){
                $scope.paginate.page=0;
            } else {
                $scope.afterSave();
            }

        });
        $scope.$watch('paginate.page',function(n,o){
            if ($scope.paginate.row==0){
                return;
            } else {
                $scope.afterSave();
            }
        });

//**********************************************************************************************
        // $scope.moment= moment;


        $scope.afterSave = function(){
            JobTicketArch.query({perPage:$scope.paginate.row , page:$scope.paginate.page},function(res){
                //console.log(res);
                if ($scope.paginate.page==0 && res.length>0){
                    $scope.paginate.totalItems=res.shift().index;
                }
                $scope.jobTickets=res;
                //console.log($scope.jobTickets);
            })
        }




        $scope.viewJobTicket = function(jobTicket){
            //console.log('dd');
            var id =(jobTicket)?jobTicket._id:'';
            $rootScope.$state.transitionTo('mainFrame.jobTicketArch.view',{'id':id});

        }
        $scope.cloneJobTicket = function(jobTicket){
            //console.log('dd');
            var id =(jobTicket)?jobTicket._id:'';
            $rootScope.$state.transitionTo('mainFrame.customerList.custom',{'id':id,'clone':'clone'});

        }

        /*$scope.deleteJobTicket = function(jobTicketArch){
            if (confirm("Удалить?")){
                jobTicketArch.$delete(function(err){
                    if (err) console.log(err);
                    $scope.afterSave();
                });
            }
        }*/
        $scope.deleteJobTicket = function(jobTicketArch){
            var modalInstance = $modal.open({templateUrl: 'myModalContentDD.html',controller: ModalInstanceCtrlDD,size: 'sm'});

            modalInstance.result.then(function (pswd) {               
                if (pswd=='2911'){
                    jobTicketArch.$delete(function(err){
                        //if (err) console.log(err);
                        $scope.afterSave();
                    });              
                }            
            }, function () {
              console.log('Modal dismissed at: ' +  Date.now());
            });
        }
        var ModalInstanceCtrlDD = function ($scope, $uibModalInstance) {
           $scope.pswd = '2';         
          $scope.ok = function (pswd) {
            $uibModalInstance.close(pswd);
          };
          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }




    }])


    .controller('jobTicketArchViewCtrl',['$scope','$rootScope','$resource','$timeout','$checkBeforClose','exception','$q','$http','Confirm',function($scope,$rootScope,$resource,$timeout,$checkBeforClose,exception,$q,$http,Confirm){


        var JobTicketArch = $resource('api/jobticketarch/:id',{id:'@_id'});
        var JobTicket = $resource('api/jobticket/:id',{id:'@_id'});
        var Shipper = $resource('api/shipper/:id',{id:'@_id'});
        var suppliers = $scope.shippers=Shipper.query(function (res) {
            suppliers=res
            //console.log(res)
        });

        JobTicketArch.get({id:$rootScope.$stateParams.id},function(res){
            //console.log(res);
            $scope.jobTicket = res;
            $scope.customer=$scope.jobTicket.customer;
            $scope.style = ($scope.jobTicket.balance>0)?"color:red":'';
            if (!$scope.jobTicket.rate){$scope.jobTicket.rate=$rootScope.config.currency['EUR'][0];}

        });


        $scope.restoreTicket=function(){
            Confirm('Уверен???').then(function () {

                $q.when()
                    .then(function () {
                        if($scope.jobTicket.createByAPI){
                            var url = 'http://46.101.131.133:7700/api/bookkeep/Zakaz/cancelByAPI/'+$scope.jobTicket.createByAPI+'?store=5a3cc10e1626aa0566f7ea87';
                            return $http.get(url);
                        }
                    })
                    .then(function (res) {
                        console.log(res);
                        delete $scope.jobTicket.__v
                        delete $scope.jobTicket.createByAPI;
                        $scope.jobTicket.sparks.forEach(function (s) {
                            delete s.rn;
                        })
                        JobTicket.save($scope.jobTicket,function(res){
                            $scope.jobTicket.$delete(function(err){
                                if (err) console.log(err);
                                //$scope.afterSave();
                            });
                            //$scope.$emit('saved');
                            $rootScope.$state.transitionTo('mainFrame.customerList.custom',{id:$scope.jobTicket._id});
                        });
                    })
                    .catch(function (err) {
                        if(err){
                            exception.catcher('отмена проводки документа',err);
                        }
                    })


            })

        }


        $scope.showElements={}

        /*$scope.quantityArr=[1,2,3,4,5,6,7,8,9];*/
        $scope.quantityArr=[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,11,12,13,14,15,16,17,19,20,21,22,23,24,25]
        $scope.jobTicket={jobs:[],sparks:[],pay:[],customer:{}}


            $rootScope.$watch('config.normaHour',function(n,o){
                if (n){
                    $scope.normaHour=$rootScope.config.normaHour;
                }else{
                    $scope.normaHour=200.00;
                }
            })
        $scope.getTotalPayInGRN = function(c){
            var sum = 0;
            if (!c){
                if ($scope.jobTicket.pay && $scope.jobTicket.pay.length){
                    for(var i= 0,l=$scope.jobTicket.pay.length;i<l;i++){
                        sum +=$scope.jobTicket.pay[i].val;
                    }
                }
                //console.log($scope.jobTicket.payGnr);
                if ($scope.jobTicket.payGrn){
                    for(var i= 0,l=$scope.jobTicket.payGrn.length;i<l;i++){
                        sum +=parseFloat(($scope.jobTicket.payGrn[i].val/$scope.jobTicket.rate).toFixed(2));
                    }
                }
            } else if (c=="EUR"){
                if ($scope.jobTicket.pay && $scope.jobTicket.pay.length){
                    for(var i= 0,l=$scope.jobTicket.pay.length;i<l;i++){
                        sum +=$scope.jobTicket.pay[i].val;
                    }
                }
            } else if(c=="GRN"){
                if ($scope.jobTicket.payGrn){
                    for(var i= 0,l=$scope.jobTicket.payGrn.length;i<l;i++){
                        sum +=$scope.jobTicket.payGrn[i].val;
                    }
                }
            }
            //console.log(sum)
            return parseFloat(sum);
        }   

        $scope.getTotalPay22 = function(c){



            var sum = 0;
            if (!c){
                if ($scope.jobTicket.pay && $scope.jobTicket.pay.length){
                    for(var i= 0,l=$scope.jobTicket.pay.length;i<l;i++){
                        sum +=$scope.jobTicket.pay[i].val;
                    }
                }
                //console.log($scope.jobTicket.payGnr);
                if ($scope.jobTicket.payGrn){
                    for(var i= 0,l=$scope.jobTicket.payGrn.length;i<l;i++){
                        sum +=parseFloat(($scope.jobTicket.payGrn[i].val/$scope.jobTicket.rate).toFixed(2));
                    }
                }
            } else if (c=="EUR"){
                if ($scope.jobTicket.pay && $scope.jobTicket.pay.length){
                    for(var i= 0,l=$scope.jobTicket.pay.length;i<l;i++){
                        sum +=$scope.jobTicket.pay[i].val;
                    }
                }
            } else if(c=="GRN"){
                if ($scope.jobTicket.payGrn){
                    for(var i= 0,l=$scope.jobTicket.payGrn.length;i<l;i++){
                        sum +=$scope.jobTicket.payGrn[i].val;
                    }
                }
            }
            //console.log(sum)
            return parseFloat(sum);
        }
        $scope.getTotalPay = function(c){
            var sum = 0;
            if (!c){
                if ($scope.jobTicket.pay && $scope.jobTicket.pay.length){
                    for(var i= 0,l=$scope.jobTicket.pay.length;i<l;i++){
                        sum +=$scope.jobTicket.pay[i].val;
                    }
                }
                //console.log($scope.jobTicket.payGnr);
                if ($scope.jobTicket.payGrn){
                    for(var i= 0,l=$scope.jobTicket.payGrn.length;i<l;i++){
                        sum +=Math.round(($scope.jobTicket.payGrn[i].val/$rootScope.config.currency['EUR'][0])*100)/100;
                    }
                }
                if ($scope.jobTicket.payBank){
                    for(var i= 0,l=$scope.jobTicket.payBank.length;i<l;i++){
                        sum +=Math.round(($scope.jobTicket.payBank[i].val/$rootScope.config.currency['EUR'][0])*100)/100;
                    }
                }
            } else if (c=="EUR"){
                if ($scope.jobTicket.pay && $scope.jobTicket.pay.length){
                    for(var i= 0,l=$scope.jobTicket.pay.length;i<l;i++){
                        sum +=$scope.jobTicket.pay[i].val;
                    }
                }
            } else if(c=="GRN"){
                if ($scope.jobTicket.payGrn){
                    for(var i= 0,l=$scope.jobTicket.payGrn.length;i<l;i++){
                        sum +=$scope.jobTicket.payGrn[i].val;
                    }
                }
                if ($scope.jobTicket.payBank){
                    for(var i= 0,l=$scope.jobTicket.payBank.length;i<l;i++){
                        sum +=$scope.jobTicket.payBank[i].val;
                    }
                }
            }

            //console.log(sum)
            return parseFloat(sum);
        }
        $scope.getTotalSpark = function(){
            var sum = 0;
            for(var i= 0,l=$scope.jobTicket.sparks.length;i<l;i++){
                sum +=$scope.jobTicket.sparks[i].price*$scope.jobTicket.sparks[i].q;
            }
            return sum;
        }
        $scope.getTotalJobs = function(){
            //console.log($scope.jobTicket);
            var sum = 0;
            for(var i= 0,l=$scope.jobTicket.jobs.length;i<l;i++){
                sum +=$scope.jobTicket.jobs[i].sum;
            }
            return sum;
        }


            var Worker = $resource('api/worker/:id',{id:'@_id'});
            $scope.workers=Worker.query();
            $scope.getNameWorker = function(worker){
                for (var i= 0,l=$scope.workers.length;i<l;i++){
                    if ($scope.workers[i]._id==worker){
                        return $scope.workers[i].name;
                        break;
                    }
                }
                return worker
            }
        $scope.getNameSupplier = function(worker){
            for (var i= 0,l=suppliers.length;i<l;i++){
                if (suppliers[i]._id==worker){
                    return suppliers[i].name;
                    break;
                }
            }
            return worker
        }
            /*$scope.getNRatioWorker = function(worker){
                for (var i= 0,l=$scope.workers.length;i<l;i++){
                    if ($scope.workers[i]._id==worker){
                        return $scope.workers[i].ratio;
                        break;
                    }
                }
            }
            $scope.getSummarySalary = function(){
                var sum = o;
                for (var ket in $scope.summary.workers.length){
                   sum += $scope.getNRatioWorker(key)*$scope.summary.workers[key];
                }
                return key;
            }*/

        $scope.$on('printTicket',function(){
            $scope.printJobTicket();
        })
        function createContent() {
            var order=$scope.jobTicket;
            var rest = $scope.jobTicket.balance+$scope.getTotalJobs()/order.rate+$scope.getTotalSpark()-$scope.getTotalPay();
            //console.log(rest);
            var style = (rest>0)?'color:red':'';

            //console.log(order);
            var s='';
            s +='<div class="container" style="font-size: 10px;"><div class="row"><div class="col-lg-8">'+
                '<h3 style="font-weight: bold; font-size: 26px; margin-top: 10px;">AUTOFAN <span style="font-size: 18px; font-weight: normal">харьков</span></h3>'+
                '<h3 style="font-size: 16px;">Наряд-заказ от  '+moment(order.date).format('lll')+' курс EUR '+order.rate.toFixed(2)+'</h3> '+
                '<h3 style="font-size: 16px;">закрыт  '+moment(order.dateClose).format('lll')+'</h3> ';


            s +='<table width="100%" cellspacing="0" cellpadding="5">'+
                '<tr><td>vin</td><td>'+order.customer.vin+'</td><td>model</td><td>'+order.customer.model+'</td></tr>' +
                '<tr><td>имя</td><td>'+order.customer.name+'</td><td>телефон</td><td>'+order.customer.phone+'</td></tr>' +
                '<tr><td>e-mail</td><td>'+order.customer.email+'</td><td>пробег</td><td>'+order.mile+'</td></tr>' +
                '</table><hr style="margin-top: 0; margin-bottom: 0; border-color: #666">';
            //console.log(s);
            var ball=(order.balance)?(order.balance).toFixed(2):'0.00';
            s +='<table width="100%" cellspacing="0" cellpadding="5">' +

                '<tr><td><b style="'+$scope.style+'">Долг '+ball+' ₴</b></td>' +
                '<tr><td><b>Всего по наряду '+($scope.getTotalSpark()+$scope.getTotalJobs() /order.rate).toFixed(2)+' ₴/'+
                ($scope.getTotalSpark()*order.rate+$scope.getTotalJobs()).toFixed(2)+
                '</b></td>' +
                '<td><b>Всего оплачено  '+($scope.getTotalPay()).toFixed(2)+' ₴/'+
                ($scope.getTotalPay('GRN')+$scope.getTotalPay('EUR')*order.rate).toFixed(2)+'</b></td>' +
                '<td><b style="'+style+'">Остаток суммы '+(rest).toFixed(2)+' ₴</b></td></tr>'+
                '</table><hr style="margin-top: 0; margin-bottom: 0; border-color: #666">';

            s += '<p style="text-align: center; margin-top: 10px; margin-bottom: 5px; ">Стоимость работ по ремонту и обслуживанию</p>' +
                '<table width="100%" cellspacing="0" cellpadding="5" border="1px">'+
                '<thead><tr><th>#</th><th>Наименование</th><th>К-во</th><th>Сумма</th></tr></thead>';
            for (var i= 0,l=order.jobs.length;i<l;i++){
                var j=order.jobs[i];
                s +='<tr><td> '+(i+1)+'</td><td>'+j.name+'</td><td>'+j.q+'</td><td>'+(j.sum*1.0000001).toFixed(2)+' грн.</td></tr>';
            }
            s+='<tr><th></th><th colspan="2">Итого</th><th>'+$scope.getTotalJobs().toFixed(2)+' грн</th></tr></table>';

            s += '<p style="text-align: center; margin-top: 10px; margin-bottom: 5px;">Стоимость запчастей</p>' +
                '<table width="100%" cellspacing="0" cellpadding="5" border="1px">'+
                '<thead><tr><th>#</th><th>Код</th><th>Наименование</th><th>Производитель</th><th>К-во</th><th>Цена</th><th>Сумма</th></tr></thead>';
            for (var i= 0,l=order.sparks.length;i<l;i++){
                var j=order.sparks[i];
                s +='<tr><td> '+(i+1)+'</td><td>'+j.code+'</td><td>'+j.name+'</td><td>'+j.producer+'</td><td>'+j.q+'</td><td>'+(j.price||0).toFixed(2)+' €'+'</td><td>'+(j.q*(j.price||0)*1.0000001).toFixed(2)+' €</td></tr>';
            }
            s+='<tr><th></th><th colspan="4">Итого</th><th>'+$scope.getTotalSpark().toFixed(2)+' €</th></tr></table>';


            s += '<p style="text-align: center; margin-top: 10px; margin-bottom: 5px;">Платежная ведомость</p>' +
                '<table width="100%" cellspacing="0" cellpadding="5" border="1px">'+
                '<thead><tr><th>#</th><th>Дата</th><th>Сумма EUR</th><th>Сумма ГРН</th></tr></thead>';
            for (var i= 0,l=order.pay.length;i<l;i++){
                var j=order.pay[i];
                s +='<tr><td> '+(i+1)+'</td><td>'+moment(j.date).format('lll')+'</td><td>'+(j.val*1.0000001).toFixed(2)+' €</td><td></td</tr>';
            }
            if (order.payGrn){
                var oldIndex=i;
                for (var i= 0,l=order.payGrn.length;i<l;i++){
                    var j=order.payGrn[i];
                    s +='<tr><td> '+(i+oldIndex+1)+'</td><td>'+moment(j.date).format('lll')+'</td><td></td><td>'+(j.val*1.0000001).toFixed(2)+' грн</td></tr>';
                }
            }
            s+='<tr><th></th><th>Итого</th><th>'+$scope.getTotalPay('EUR').toFixed(2)+' €</th><th>'+$scope.getTotalPay('GRN').toFixed(2)+' грн</th></tr></table><br>';




            s += '<table width="100%" cellspacing="0" cellpadding="5"">' +
                '<tr><td>Подпись исполнителя</td><td>______________________</td><td>Подпись заказчика</td><td>________________________</td></tr></table>'
            s +='';
            var k=0;
            s += '<tr><td colspan="5"><p style="text-align: center; margin-top: 10px; margin-bottom: 5px;">Комментарии</p>' +
                '<table width="100%" cellspacing="0" cellpadding="5" border="1px">'+
                '<thead><tr><th>'+((order.text)?order.text:'')+'</th></tr></thead></table></td></tr>';
            return s;
        }


        $scope.printJobTicket = function(){
            var popupWin=window.open();
            popupWin.window.focus();
            var printContents = createContent();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.css" />' +
                '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div>' +
                //'<script>setTimeout(function(){ window.parent.focus(); window.close() }, 100)</script>' +
                '</html>');

            $timeout(function () {
                popupWin.print();
            });

        }
        $scope.sendEmail = function(){

            var s=createContent();

            $resource('/api/sendEmailCustomer').save({body:s,name:$scope.jobTicket.customer.name,
                email:$scope.jobTicket.customer.email},function(res){
                $scope.buttonDisabled=false;
                //console.log(res);
                alert('вроде ушло')

            },function(err){
                $scope.buttonDisabled=false;
                alert('какая-то ошибка!')
            })
        }

            /*$scope.cloneJobTicket = function(jobTicket){
                //console.log('dd');
                var id =(jobTicket)?jobTicket._id:'';
                $rootScope.$state.transitionTo('mainFrame.customerList.custom',{'id':id,'clone':'clone'});

            }*/

            $scope.createByAPI=function () {
                console.log('createByAPI')
                $q.when()
                    .then(function () {
                        $checkBeforClose.createByAPI($scope.jobTicket)
                    })
                    .then(function () {
                        JobTicketArch.save($scope.jobTicket).$promise
                    })
                    .then(function () {
                        exception.showToaster('info','обработка данных в бухгалтерии','все прошло успешно');
                    })
            }

    }])




    .controller('workersCtrl',['$scope','$rootScope','$resource',function($scope,$rootScope,$resource){
        var Worker = $resource('api/worker/:id',{id:'@_id'});

        function afterChangeWorker(){
            $scope.workers=Worker.query();
            $scope.worker={name:''};
        }
        afterChangeWorker()


        $scope.saveWorker=function(form){
            if ($scope.worker.name){
                Worker.save($scope.worker,function(){
                    afterChangeWorker()
                })
            }

        }


        $scope.changeWorker=function(id){
            //afterChangeJobName(id)
            if (!id){
                $scope.worker={name:''};
            } else {
                for(var i= 0,l=$scope.workers.length;i<l;i++){
                    if($scope.workers[i]._id==id){
                        $scope.worker=$scope.workers[i];
                        break;
                    }
                }
            }
        }
        $scope.deleteWorker=function(){
            if ($scope.worker._id){
                if (confirm("Удалить?")){
                    $scope.worker.$delete(function(e){
                        //console.log('ss');
                        afterChangeWorker()
                    });
                }
            }
        }


    }])
    .controller('shippersCtrl',['$scope','$rootScope','$resource',function($scope,$rootScope,$resource){
        var Shipper = $resource('api/shipper/:id',{id:'@_id'});

        function afterChangeShipper(){
            $scope.shippers=Shipper.query();
            $scope.shipper={name:''};
        }
        afterChangeShipper()


        $scope.saveShipper=function(form){
            if ($scope.shipper.name){
                Shipper.save($scope.shipper,function(){
                    afterChangeShipper()
                })
            }

        }


        $scope.changeShipper=function(id){
            //afterChangeJobName(id)
            if (!id){
                $scope.shipper={name:''};
            } else {
                for(var i= 0,l=$scope.shippers.length;i<l;i++){
                    if($scope.shippers[i]._id==id){
                        $scope.shipper=$scope.shippers[i];
                        break;
                    }
                }
            }
        }
        $scope.deleteShipper=function(){
            if ($scope.shipper._id){
                if (confirm("Удалить?")){
                    $scope.shipper.$delete(function(e){
                        //console.log('ss');
                        afterChangeShipper()
                    });
                }
            }
        }


    }])

    .controller('convertCtrl',['$scope','$rootScope','$resource',function($scope,$rootScope,$resource){
        var Convert = $resource('/api/jobticket/convert/:type',{type:'@type'});
        var Convert1 = $resource('/api/jobticketarch/convert/:type',{type:'@type'});
        $scope.convertTicket = function(){
            Convert.get({type:'ticket'},function(res){
                alert(res.msg)
            });
        }
        $scope.convertTicketArch = function(){
            Convert1.get({type:'arch'},function(res){
                alert(res.msg)
            });
        }
    }])



    .controller('summaryCtrl', ['$scope','$rootScope','$timeout','$resource','$checkBeforClose','$q',
        function ($scope,$rootScope,$timeout,$resource,$checkBeforClose,$q) {
            //var Worker = $resource('api/worker/:id',{id:'@_id'});
            //var Shipper = $resource('api/shipper/:id',{id:'@_id'});

            var Producer = $resource('http://46.101.131.133:7700/api/collections/Producer/:id',{id:'@_id',store:'5a3cc10e1626aa0566f7ea87'});
            var Worker = $resource('http://46.101.131.133:7700/api/collections/Worker/:_id',{_id:'@_id',store:'5a3cc10e1626aa0566f7ea87'});
            var Supplier = $resource('http://46.101.131.133:7700/api/collections/Supplier/:_id',{_id:'@_id',store:'5a3cc10e1626aa0566f7ea87'});
            var Zakaz = $resource('http://46.101.131.133:7700/api/collections/Zakaz/:_id',{_id:'@_id',store:'5a3cc10e1626aa0566f7ea87',populate:true});
            //var warehouseSaldo = $resource('http://139.162.161.36:7700/api/bookkeep/warehouse/:start/:end',{start:'@start',end:'@end',store:'5a3cc10e1626aa0566f7ea87'});
            var warehouseSaldo = $resource('http://46.101.131.133:7700/api/bookkeep/warehouse/:start/:end',{start:'@start',end:'@end',store:'5a3cc10e1626aa0566f7ea87'});

            var Shipper = $resource('api/shipper/:id',{id:'@_id'});
            var OldWorker = $resource('api/worker/:id',{id:'@_id'});
            $scope.workers=[];
            $scope.OldWorker=[]
            $scope.Shipper=[];
            $scope.currencyArr=['UAH',"EUR",'USD']



            var JobTicketArch = $resource('api/jobticketarch/:id',{id:'@_id'});
            var JobTicket     = $resource('api/jobticket/:id',{id:'@_id'});
            $scope.summary={orders:[],users:[]};
            $scope.dt  = new Date();
            $scope.today = function(t) {
                if (t)
                    return $scope.dt.setHours(0,0,0);
                else
                    return $scope.dt.setHours(23,59,59);
            };
            $scope.dtto = $scope.today();
            $scope.dtfrom=$scope.today(true);

            $scope.clear = function () {
                $scope.dtto= $scope.dtfrom= null;
            };
            $scope.openfrom = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.openedfrom = true;
            };
            $scope.opento = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.openedto = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            //$scope.initDate = new Date('2016-15-20');
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            var workerJobs={};
            $scope.getPn=function (el) {
                $q.when()
                    .then(function () {
                        var start=new Date($scope.dtfrom);
                        var end=new Date($scope.dtto);
                        if (start>end) return;
                        return $checkBeforClose.getPn(el,start,end)
                    })
            }
            $scope.getDetailWorker= function (worker) {
                console.log(workerJobs[worker])
                if(!workerJobs[worker]){return}
                $q.when()
                    .then(function () {
                        var start=new Date($scope.dtfrom);
                        var end=new Date($scope.dtto);
                        return $checkBeforClose.showWokerJobs(workerJobs[worker],start,end)
                    })
            }
            $scope.getDetailZakaz=function (id) {
                console.log(id)
                $q.when()
                    .then(function () {
                        return $checkBeforClose.getDetailZakaz(id)
                    })
            }

            activate()
            function activate(){

                Supplier.query(function(res){
                    console.log(res)
                    if(res){res.shift()};
                    $scope.shippers=res;
                    //console.log($scope.workers)
                });

                OldWorker.query(function(res){
                    console.log(res)
                    if(res){res.shift()};
                    $scope.oldWorkers=res;
                    //console.log($scope.workers)
                });
                Shipper.query(function(res){
                    console.log(res)
                    if(res){res.shift()};
                    $scope.oldShippers=res;
                    //console.log($scope.workers)
                });
            }

            $scope.getList = function(){
                var start=new Date($scope.dtfrom);
                var end=new Date($scope.dtto);
                if (start>end) return;
                //console.log($scope.dtfrom+'  '+$scope.dtto);
                //console.log(new Date($scope.dtfrom));
                $scope.summary.shippersIncomePrice=0;
                $scope.summary.shippersSum=0;
                var ids=[];
                $q.when()
                    .then(function(){
                        return JobTicketArch.query({dtfrom:start.toString(),dtto:end.toString(),perPage:1000,data:'all'}).$promise;
                    })
                    .then(function(res){
                        //console.log(res)
                        if (res.length>0){
                            res.shift();
                        }
                        var orders=[];
                        var ordersSum={jobs:0,priceShip:0,price:0,diff:0,pay:0,income:0};
                        var workers ={};
                        var shippers ={};
                        var supplierJobs={};

                        for (var i= 0,l=res.length;i<l;i++){
                            if(res[i].createByAPI){
                                ids.push(res[i].createByAPI)
                            }
                            orders[i]={};
                            orders[i].vin=res[i].customer.vin;
                            orders[i].date=res[i].date;
                            var sum=0;
                            for (var j= 0,lj=res[i].jobs.length;j<lj;j++){
                                res[i].jobs[j].vin=res[i].customer.vin
                                res[i].jobs[j].date=moment(res[i].date).format('LLL')
                                //console.log(res[i].jobs[j].worker,Math.round(res[i].jobs[j].sum*100)/100)
                                if(res[i].jobs[j].supplierType){
                                    console.log(res[i].jobs[j])
                                    if (!supplierJobs[res[i].jobs[j].supplier]){
                                        supplierJobs[res[i].jobs[j].supplier]=[]

                                     }
                                    var o = {
                                        sum:res[i].jobs[j].sum,
                                        incomeSum:res[i].jobs[j].incomeSum,
                                        worker:res[i].jobs[j].worker,
                                        vin:res[i].jobs[j].vin,
                                    }
                                    supplierJobs[res[i].jobs[j].supplier].push(o)
                                }else{
                                    res[i].jobs[j].sum=Math.round(res[i].jobs[j].sum*100)/100
                                    sum+=res[i].jobs[j].sum;
                                    if (!workers[res[i].jobs[j].worker]){
                                        workerJobs[res[i].jobs[j].worker]=[];
                                        workerJobs[res[i].jobs[j].worker].push(res[i].jobs[j]);
                                        workers[res[i].jobs[j].worker]=res[i].jobs[j].sum
                                    } else {
                                        workers[res[i].jobs[j].worker]+=res[i].jobs[j].sum;
                                        workerJobs[res[i].jobs[j].worker].push(res[i].jobs[j])
                                    }
                                    workers[res[i].jobs[j].worker]=Math.round(workers[res[i].jobs[j].worker]*100)/100
                                }


                            }
                            orders[i].jobsSum=Math.round(sum*100)/100;
                            //console.log(workers)


                            sum=0;
                            var sum1=0;
                            for (var j= 0,lj=res[i].sparks.length;j<lj;j++){
                                var incomePrice=(res[i].sparks[j].incomePrice)?res[i].sparks[j].incomePrice:0;
                                var price = (res[i].sparks[j].price)?res[i].sparks[j].price:0;
                                sum1+=incomePrice*res[i].sparks[j].q;
                                sum+=price*res[i].sparks[j].q;
                                //console.log(res[i].sparks[j].priceShip);
                                // shippers
                                if(res[i].sparks[j].supplier){
                                    if(!shippers[res[i].sparks[j].supplier]){
                                        shippers[res[i].sparks[j].supplier]={
                                            _id:res[i].sparks[j].supplier,
                                            sum:0,
                                            incomePrice:0,
                                            sparks:[]
                                        }
                                    }
                                    var sp={}
                                    sp.code=res[i].sparks[j].code;
                                    sp.name=res[i].sparks[j].name;
                                    sp.q=res[i].sparks[j].q;
                                    sp.incomePrice=incomePrice*sp.q;
                                    sp.price=price*sp.q;
                                    sp.invoice=res[i].sparks[j].invoice;

                                    sp.vin=res[i].customer.vin;
                                    sp.date=moment(res[i].date).format('ll');
                                    shippers[res[i].sparks[j].supplier].sparks.push(sp)
                                    shippers[res[i].sparks[j].supplier].sum+=sp.price
                                    shippers[res[i].sparks[j].supplier].incomePrice+=sp.incomePrice
                                }
                            }
                            orders[i].priceShip=sum1;
                            orders[i].price=sum;
                            orders[i].diff=orders[i].price-orders[i].priceShip;
                            sum=0;
                            for (var j= 0,lj=res[i].pay.length;j<lj;j++){
                                sum+=res[i].pay[j].val;
                            }
                            orders[i].pay=sum;

                            orders[i].income=sum-sum1;

                            ordersSum.jobs+=orders[i].jobsSum;
                            ordersSum.priceShip+=orders[i].priceShip;
                            ordersSum.price+=orders[i].price;
                            ordersSum.diff+=orders[i].diff;
                            ordersSum.pay+=orders[i].pay;
                            ordersSum.income+=orders[i].income;
                            orders[i].sparks=res[i].sparks;
                            orders[i].jobs=res[i].jobs;
                            orders[i].dateClose=res[i].dateClose;
                            orders[i].createByAPI=res[i].createByAPI;


                        }
                        $scope.summary.supplierJobs= supplierJobs;
                        $scope.summary.orders=orders;
                        $scope.summary.ordersSum=ordersSum;
                        $scope.summary.workers=workers;
                        $scope.summary.workersSum=0;
                        $scope.summary.avansSum=0;
                        $scope.summary.avansSumInDate=0;
                        $scope.summary.avansSumGrn=0;
                        $scope.summary.avansSumGrnInDate=0;
                        $scope.summary.avans=[];
                        $scope.summary.shippers=[];
                        for(var _id in shippers){
                            $scope.summary.shippers.push(shippers[_id])
                            $scope.summary.shippersIncomePrice+=shippers[_id].incomePrice
                            $scope.summary.shippersSum+=shippers[_id].sum
                        }
                        for (var key in workers){
                            $scope.summary.workersSum+=workers[key];
                        }
                        //console.log(workers)
                        getOrderWithAvans(start,end)
                        if(ids && ids.length){
                            return Zakaz.query({page:0,perPage:1000,query:{_id:{$in:ids}}}).$promise;
                        }

                        /*$scope.summary.orders = res[0];
                         $scope.totalQuantity=0;
                         $scope.totalSum=0;
                         //console.log($scope.summary.orders);
                         for (var i in $scope.summary.orders){
                         // console.log($scope.summary.orders[i]);
                         if ($scope.summary.orders[i].quantity){
                         $scope.totalQuantity +=$scope.summary.orders[i].quantity;
                         $scope.totalSum += $scope.summary.orders[i].sum;
                         }

                         }
                         $scope.summary.users=res[1];*/
                    })
                    .then(function (res) {
                        if (res && res.length>0){
                            res.shift();
                            $scope.zakazs = res;
                            //console.log($scope.zakazs)
                            $scope.summary.zakazSalary={}
                            $scope.summary.orders.forEach(function (item) {
                                if(item.createByAPI){
                                    var zak;
                                    for(var i = 0;i<$scope.zakazs.length;i++){
                                        if($scope.zakazs[i]._id===item.createByAPI){
                                            zak=$scope.zakazs[i];
                                            break;
                                        }
                                    }
                                    if(zak){
                                        item.salary={
                                            name:zak.worker.name,
                                            sum : zak.totalSumWorker['EUR']
                                        }
                                        if(!$scope.summary.zakazSalary[item.salary.name]){
                                            $scope.summary.zakazSalary[item.salary.name]=item.salary.sum;
                                        }else{
                                            $scope.summary.zakazSalary[item.salary.name]+=item.salary.sum;
                                        }
                                        //console.log(item.salary)
                                    }
                                }
                            })
                            $scope.summary.zakazSalarySum=0;
                            for(let key in $scope.summary.zakazSalary){
                                $scope.summary.zakazSalarySum+=$scope.summary.zakazSalary[key]
                            }
                            //console.log($scope.summary.zakazSalary)
                        }
                        return Worker.query().$promise;
                    })
                    .then(function(res){
                        $scope.summary.totalSum={}
                        $scope.summary.totalSumWorker={}
                        $scope.summary.totalSumUchet={}
                        $scope.summary.totalSumRevenue={}
                        $scope.currencyArr.forEach(function (c) {
                            $scope.summary.totalSum[c]=0;
                            $scope.summary.totalSumWorker[c]=0;
                            $scope.summary.totalSumUchet[c]=0;
                        })

                        if(res){res.shift()};
                        $scope.workers=res;
                        let materialsIncome=[];
                        let materialsOutcome=[];
                        let sumForIncome={}
                        let sumForOutcome={}
                        $scope.currencyArr.forEach(function (c) {
                            sumForIncome[c]=0;
                            sumForOutcome[c]=0;
                        })
                        $scope.zakazs.forEach(function (zak) {
                            let materialsIncome22=[]
                            let materialsOutcome22=[];
                            //console.log(zak)
                            $scope.currencyArr.forEach(function (c) {
                                $scope.summary.totalSum[c]+=zak.totalSum[c]
                                $scope.summary.totalSumWorker[c]+=zak.totalSumWorker[c]
                                $scope.summary.totalSumUchet[c]+=zak.totalUchet[c]
                                /*console.log($scope.summary.totalSum[c])
                                console.log($scope.summary.totalSumWorker[c])
                                console.log($scope.summary.totalSumUchet[c])*/
                            })


                            /*для внешних работ*/
                            if(zak.pns && zak.pns.length){
                                materialsIncome22 = zak.pns.reduce(function (materials,pn) {
                                    if(pn && pn.materials && pn.materials.length){
                                        pn.materials.forEach(function (m) {
                                            m.linkData={
                                                name:pn.name,
                                                uisref:'frame.pns.pn',
                                                id:pn._id
                                            }
                                            m.item.sku2 = (m.item.sku2 && m.item.sku2.length)?m.item.sku2[0]:''
                                            m.sum = Math.round((m.qty*m.price)*100)/100;
                                            sumForIncome[pn.currency]+=m.sum;
                                            m.currency=pn.currency
                                            m.supplier=pn.contrAgent;
                                            m.virtualAccount=pn.virtualAccount;
                                            m.worker=zak.worker.name;
                                            materials.push(m);

                                        })
                                    }
                                    return materials;
                                },[])
                            }
                            if(zak.rns && zak.rns.length){
                                materialsOutcome22 = zak.rns.reduce(function (materials,rn) {
                                    //console.log('rn.materials.length',rn.materials.length)
                                    if(rn && rn.materials && rn.materials.length){
                                        rn.materials.forEach(function (m) {
                                            m.linkData={
                                                name:rn.name,
                                                uisref:'frame.Rn.item',
                                                id:rn._id
                                            }
                                            m.item.sku2 = (m.item.sku2 && m.item.sku2.length)?m.item.sku2[0]:''
                                            m.sum = Math.round((m.qty*m.priceForSale)*100)/100;
                                            sumForOutcome[rn.currency]+=m.sum;
                                            m.currency=rn.currency
                                            m.virtualAccount=rn.virtualAccount;
                                            materials.push(m);
                                            //console.log("materials.push(m);",materials.length)
                                        })
                                    }
                                    return materials;
                                },[])
                            }
                            materialsIncome=materialsIncome.concat(materialsIncome22)
                            materialsOutcome=materialsOutcome.concat(materialsOutcome22)
                        })
                        /*console.log(materialsIncome)
                        console.log(sumForIncome)*/
                        /*console.log(materialsOutcome)
                        console.log(sumForOutcome)
                        let outcomeWorkSalary = {}*/
                        $scope.summary.supplierJobsIncomePrice=0;
                        $scope.summary.supplierJobsSum=0;
                        $scope.summary.supplierJobsSalary=0;
                        $scope.summary.supplierJobsDelta=0;
                        materialsIncome.forEach(m=>{
                            for(let i=0;i<materialsOutcome.length;i++){
                                if(m.item._id===materialsOutcome[i].item._id && m.supplier===materialsOutcome[i].supplier && m.virtualAccount===materialsOutcome[i].virtualAccount){
                                //if(m.item._id===materialsOutcome[i]._id){
                                    m.priceForSale = materialsOutcome[i].priceForSale;
                                    m.is = true
                                    break;
                                }
                            }
                            if(m.is){
                                m.delta = Math.round((m.qty*m.priceForSale)*100)/100-Math.round((m.qty*m.price)*100)/100;
                                m.salary = Math.round((m.delta*0.25)*100)/100;
                                $scope.summary.supplierJobsIncomePrice+=m.price;
                                $scope.summary.supplierJobsSum+=m.priceForSale;
                                $scope.summary.supplierJobsDelta+=m.delta;
                                $scope.summary.supplierJobsSalary+=m.salary;
                            }
                        })
                        $scope.summary.supplierJobsIncomePrice=Math.round(($scope.summary.supplierJobsIncomePrice)*100)/100;
                        $scope.summary.supplierJobsSum=Math.round(($scope.summary.supplierJobsSum)*100)/100;
                        $scope.summary.supplierJobsDelta=Math.round(($scope.summary.supplierJobsDelta)*100)/100;
                        $scope.summary.supplierJobsSalary=Math.round(($scope.summary.supplierJobsSalary)*100)/100;
                        $scope.summary.supplierJobs=materialsIncome;

                        $scope.currencyArr.forEach(function (c) {
                            $scope.summary.totalSum[c]=Math.round($scope.summary.totalSum[c]*100)/100
                            $scope.summary.totalSumWorker[c]=Math.round($scope.summary.totalSumWorker[c]*100)/100
                            $scope.summary.totalSumUchet[c]=Math.round($scope.summary.totalSumUchet[c]*100)/100
                            $scope.summary.totalSumRevenue[c]=$scope.summary.totalSum[c]-$scope.summary.totalSumWorker[c]-$scope.summary.totalSumUchet[c];
                            $scope.summary.totalSumRevenue[c]=Math.round($scope.summary.totalSumRevenue[c]);
                        })


                    })
                    .then(function(){
                        return warehouseSaldo.get({start:start.toString(),end:end.toString()}).$promise;
                    })
                    .then(function(res){
                       console.log(res)
                        $scope.summary.warehouse=res;

                    })



            }

            $scope.getDetailForWarehouse=function (currency) {
                $checkBeforClose.getWarehouseDetail($scope.summary.warehouse.materials,currency)
            }

            $scope.getNameWorker = function(worker){
                //console.log(worker)
                for (var i= 0,l=$scope.oldWorkers.length;i<l;i++){
                    if ($scope.oldWorkers[i]._id==worker){
                        return $scope.oldWorkers[i].name;
                        break;
                    }
                }
                return worker
            };
            $scope.getNameShipper = function(shipper){

                for (var i= 0,l=$scope.oldShippers.length;i<l;i++){
                    //console.log(shipper,$scope.oldShippers[i]._id,shipper==$scope.oldShippers[i]._id)
                    if ($scope.oldShippers[i]._id==shipper){
                        return $scope.oldShippers[i].name;
                        break;
                    }
                }
                /*for (var i= 0,l=$scope.suppliers.length;i<l;i++){
                    if ($scope.suppliers[i]._id==shipper){
                        return $scope.suppliers[i].name;
                        break;
                    }
                }*/
                return shipper
            };
            //54105227f6569748187b1ae0
            $scope.getNameWorker2 = function(job){
                //console.log(job.worker)
                for (var i= 0,l=$scope.oldWorkers.length;i<l;i++){
                    if ($scope.oldWorkers[i]._id==job.worker){
                        return $scope.oldWorkers[i].name;
                        break;
                    }
                }
                return job.worker

            };
            $scope.getSumForWorker = function(worker,sum){
                for (var i= 0,l=$scope.workers.length;i<l;i++){
                    //console.log($scope.workers[i]);
                    if ($scope.workers[i].name==worker){

                        //return $scope.workers[i].ratio;
                        //console.log(Math.round((($scope.workers[i].rateWork*sum)/100)*100)/100)
                        return Math.round((($scope.workers[i].rateWork*sum)/100)*100)/100;
                        //console.log($scope.workers[i].ratio);
                        break;
                    }
                }
                for (var i= 0,l=$scope.oldWorkers.length;i<l;i++){
                    if ($scope.oldWorkers[i]._id==worker){
                        return Math.round(($scope.oldWorkers[i].ratio*sum)*100)/100;
                        break;
                    }
                }
                return Math.round(50*sum)/100;

            }
            $scope.getRatioWorker = function(worker,sum){
                for (var i= 0,l=$scope.workers.length;i<l;i++){
                    //console.log($scope.workers[i]);
                    if ($scope.workers[i].name==worker){
                        return $scope.workers[i].rateWork
                        break;
                    }
                }
                for (var i= 0,l=$scope.oldWorkers.length;i<l;i++){
                    if ($scope.oldWorkers[i]._id==worker){
                        return $scope.oldWorkers[i].ratio
                        break;
                    }
                }
                return 50;

            }
            $scope.getSummarySalary = function(){
                var sum = 0;
                for (var key in $scope.summary.workers){
                    if(typeof $scope.summary.workers[key]!='object'){
                        sum += $scope.getSumForWorker(key,$scope.summary.workers[key])
                        //sum += $scope.getRatioWorker(key)*$scope.summary.workers[key];
                    }else{
                        sum += $scope.summary.workers[key].incomeSum
                    }

                }
                return sum;
            }


            function getOrderWithAvans(start,end){
                var query='{"resPay":{"$gt":0}}';
                var query='{ "$where": "(this.payGrn && this.payGrn.length)||(this.pay && this.pay.length)"}'
                JobTicket.query({dtfrom:start.toString(),dtto:end.toString(),perPage:300,query:query},function(res){
                    //console.log(res)
                    if (res.length>0){
                        res.shift();
                    }
                    //console.log(res)
                    $scope.summary.avans=res;
                    $scope.summary.avans.forEach(function(el){
                        el.paySum=0;
                        if(el.pay.length){
                            el.paySum= el.pay.reduce(function(sum, current) {
                                return sum + current.val;
                            }, 0);
                        }
                        el.payGrnSum=0;
                        if(el.payGrn.length){
                            el.payGrnSum= el.payGrn.reduce(function(sum, current) {
                                return sum + current.val;
                            }, 0);
                        }

                        $scope.summary.avansSum+=el.paySum;
                        $scope.summary.avansSumGrn+=el.payGrnSum;
                    })
                    var range = moment().range(start, end);
                    $scope.summary.avansInDate=$scope.summary.avans.filter(function(el){
                        var order=angular.copy(el);
                        if(order.pay.length){
                            order.pay= order.pay.filter(function(pay){
                                console.log(range.contains(moment(pay.date)))
                                return range.contains(moment(pay.date))
                            })
                        }
                        if(order.payGrn.length){
                            order.payGrn= order.payGrn.filter(function(pay){
                                console.log(range.contains(moment(pay.date)))
                                return range.contains(moment(pay.date))
                            })
                        }
                        return order.pay.length||order.payGrn.length;
                    })
                    $scope.summary.avansInDate.forEach(function(el){
                        el.paySum=0;
                        if(el.pay.length){
                            el.paySum= el.pay.reduce(function(sum, current) {
                                return sum + current.val;
                            }, 0);
                        }
                        el.payGrnSum=0;
                        if(el.payGrn.length){
                            el.payGrnSum= el.payGrn.reduce(function(sum, current) {
                                return sum + current.val;
                            }, 0);
                        }

                        $scope.summary.avansSumInDate+=el.paySum;
                        $scope.summary.avansSumGrnInDate+=el.payGrnSum;
                    })


                })
            }



        }])



   .controller('slidesCtrl', ['$scope','$resource','$state',function ($scope,$resource,$state) {
        var Items=$resource('/api/collections/Slide/:id',{id:'@_id'});           
            $scope.Items=Items;
        //var query='{role:brandAdmin}';
        
        $scope.groupSetup = {
            multiple: true,
            formatSearching: 'Searching the group...',
            formatNoMatches: 'Не найдено',
            width: '50%'
        };



        $scope.paginate={page:0,row:0,totalItems:0}
        $scope.$watch('paginate.row',function(n,o){
            if (!n) return;
            if ($scope.paginate.page>0){
                $scope.paginate.page=0;
            } else {
                $scope.afterSave();
            }

        });
        $scope.$watch('paginate.page',function(n,o){
            if ($scope.paginate.row==0){
                return;
            } else {
                $scope.afterSave();
            }
        });


        $scope.editItem=function(item){
            $scope.item=item;
            $scope.disEdit=false;
            
        }

        $scope.afterSave = function(){
            Items.query({perPage:$scope.paginate.row , page:$scope.paginate.page},function(res){
                if ($scope.paginate.page==0 && res.length>0){
                    $scope.paginate.totalItems=res.shift().index;
                }
                $scope.items=res;
                $scope.item={};
                $scope.item.city='';
                $scope.disEdit=true;
                $scope.noLoad=true;
                $scope.noChange=true;
                
            })
        };

        $scope.updateItem =  function(item){
            Items.save(item,function(res){
                $scope.afterSave();
            });
        }
        $scope.deleteItem = function(item){
            if (confirm("Удалить?")){
                item.$delete(function(err){
                    if (err) console.log(err);
                    $scope.afterSave();
                });
            }
        }



        
        
    }])


  .controller('vendorCtrl', ['$scope','$resource','$state',function ($scope,$resource,$state) {
        var Items=$resource('/api/collections/Vendor/:id',{id:'@_id'});           
            $scope.Items=Items;
        //var query='{role:brandAdmin}';
        
        $scope.groupSetup = {
            multiple: true,
            formatSearching: 'Searching the group...',
            formatNoMatches: 'Не найдено',
            width: '50%'
        };



        $scope.paginate={page:0,row:0,totalItems:0}
        $scope.$watch('paginate.row',function(n,o){
            if (!n) return;
            if ($scope.paginate.page>0){
                $scope.paginate.page=0;
            } else {
                $scope.afterSave();
            }

        });
        $scope.$watch('paginate.page',function(n,o){
            if ($scope.paginate.row==0){
                return;
            } else {
                $scope.afterSave();
            }
        });


        $scope.editItem=function(item){
            $scope.item=item;
            $scope.disEdit=false;
            
        }

        $scope.afterSave = function(){
            Items.query({perPage:$scope.paginate.row , page:$scope.paginate.page},function(res){
                if ($scope.paginate.page==0 && res.length>0){
                    $scope.paginate.totalItems=res.shift().index;
                }
                $scope.items=res;
                $scope.item={};
                $scope.item.city='';
                $scope.disEdit=true;
                $scope.noLoad=true;
                $scope.noChange=true;
                
            })
        };

        $scope.updateItem =  function(item){
            Items.save(item,function(res){
                $scope.afterSave();
            });
        }
        $scope.deleteItem = function(item){
            if (confirm("Удалить?")){
                item.$delete(function(err){
                    if (err) console.log(err);
                    $scope.afterSave();
                });
            }
        }



        
        
    }])
 .controller('makerCtrl', ['$scope','$resource','$state',function ($scope,$resource,$state) {
        var Items=$resource('/api/collections/Maker/:id',{id:'@_id'});           
            $scope.Items=Items;
        //var query='{role:brandAdmin}';
        
        $scope.groupSetup = {
            multiple: true,
            formatSearching: 'Searching the group...',
            formatNoMatches: 'Не найдено',
            width: '50%'
        };



        $scope.paginate={page:0,row:0,totalItems:0}
        $scope.$watch('paginate.row',function(n,o){
            if (!n) return;
            if ($scope.paginate.page>0){
                $scope.paginate.page=0;
            } else {
                $scope.afterSave();
            }

        });
        $scope.$watch('paginate.page',function(n,o){
            if ($scope.paginate.row==0){
                return;
            } else {
                $scope.afterSave();
            }
        });


        $scope.editItem=function(item){
            $scope.item=item;
            $scope.disEdit=false;
            
        }

        $scope.afterSave = function(){
            Items.query({perPage:$scope.paginate.row , page:$scope.paginate.page},function(res){
                if ($scope.paginate.page==0 && res.length>0){
                    $scope.paginate.totalItems=res.shift().index;
                }
                $scope.items=res;
                $scope.item={};
                $scope.item.city='';
                $scope.disEdit=true;
                $scope.noLoad=true;
                $scope.noChange=true;
                
            })
        };

        $scope.updateItem =  function(item){
            Items.save(item,function(res){
                $scope.afterSave();
            });
        }
        $scope.deleteItem = function(item){
            if (confirm("Удалить?")){
                item.$delete(function(err){
                    if (err) console.log(err);
                    $scope.afterSave();
                });
            }
        }



        
        
    }])


.controller('storeCtrl', ['$scope','$resource','$state',function ($scope,$resource,$state) {
        var Items=$resource('/api/collections/SparePart/:id',{id:'@_id'});           
            $scope.Items=Items;
        //var query='{role:brandAdmin}';
        $resource('/api/collections/Maker/:id',{id:'@_id'}).query(function(res){
            res.shift();
            $scope.makers=res;
        }); 
        $scope.groupSetup = {
            multiple: true,
            formatSearching: 'Searching the group...',
            formatNoMatches: 'Не найдено',
            width: '50%'
        };



        $scope.paginate={page:0,row:0,totalItems:0}
        $scope.$watch('paginate.row',function(n,o){
            if (!n) return;
            if ($scope.paginate.page>0){
                $scope.paginate.page=0;
            } else {
                $scope.afterSave();
            }

        });
        $scope.$watch('paginate.page',function(n,o){
            if ($scope.paginate.row==0){
                return;
            } else {
                $scope.afterSave();
            }
        });


        $scope.editItem=function(item){
            $scope.item=item;
            $scope.disEdit=false;
            
        }
        $scope.canselUpdateItem = function(){
            $scope.item=null;
            $scope.disEdit=true;
            $scope.afterSave();
        }

        $scope.afterSave = function(){
            Items.query({perPage:$scope.paginate.row , page:$scope.paginate.page},function(res){
                if ($scope.paginate.page==0 && res.length>0){
                    $scope.paginate.totalItems=res.shift().index;
                }
                $scope.items=res;
                $scope.item={};
                
                $scope.disEdit=true;
                $scope.noLoad=true;
                $scope.noChange=true;
                
            })
        };

        $scope.updateItem =  function(item){
            Items.save(item,function(res){
                $scope.afterSave();
            },function(err){
                console.log(err);
                alert(err.data.error)
            });
        }
        $scope.deleteItem = function(item){
            if (confirm("Удалить?")){
                item.$delete(function(err){
                    if (err) console.log(err);
                    $scope.afterSave();
                });
            }
        }


        $scope.getMakerName = function(id){
            var r=globalFunction.getObjectFromArray($scope.makers,'_id',id);
            return (r)?r.name: '';
        }
        
        
    }])

