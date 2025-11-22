"use strict";(()=>{var e={};e.id=402,e.ids=[402],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},4355:(e,t,r)=>{r.r(t),r.d(t,{config:()=>d,default:()=>u,routeModule:()=>p});var i={};r.r(i),r.d(i,{default:()=>s});var a=r(1802),o=r(7153),n=r(6249);async function s(e,t){if("GET"!==e.method)return t.status(405).json({error:"Method not allowed"});let r=`name,sku,price,hidePrice,description,category,stockStatus,features,images
"Example Product","EX-001",29.99,false,"This is a sample product description","Electronics","IN_STOCK","Feature 1, Feature 2, Feature 3","https://example.com/image1.jpg, https://example.com/image2.jpg"

# Instructions:
# - name: Product name (required)
# - sku: Unique product identifier (required)
# - price: Product price as number (required)
# - hidePrice: true/false to hide price display (optional, default: false)
# - description: Full product description (required)
# - category: Category name - must match existing category (required)
# - stockStatus: IN_STOCK, LOW_STOCK, OUT_OF_STOCK, or BACKORDER (optional, default: IN_STOCK)
# - features: Comma-separated list of features (optional)
# - images: Comma-separated list of image URLs (optional)
#
# Notes:
# - If SKU already exists, the product will be UPDATED with new data
# - Use quotes around fields containing commas
# - Delete these instruction lines before importing
`;t.setHeader("Content-Type","text/csv"),t.setHeader("Content-Disposition","attachment; filename=product-import-template.csv"),t.status(200).send(r)}let u=(0,n.l)(i,"default"),d=(0,n.l)(i,"config"),p=new a.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/products/template",pathname:"/api/products/template",bundlePath:"",filename:""},userland:i})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=4355);module.exports=r})();