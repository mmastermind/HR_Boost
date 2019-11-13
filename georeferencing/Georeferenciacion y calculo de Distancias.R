rm(list=ls())
require(foreign)
library(sf)
require(geos_combine)
library(ggplot2)
library(rgdal)
library(GISTools)
library(sp)
library(rgeos)
library(raster)
library(tmaptools)
require(taRifx)
library(dplyr)
library(haven)
library(reshape2)
library(RColorBrewer)
library(png)
library(OpenStreetMap)
library(data.table)
library(formattable)
library(flextable)
library(BAMMtools)
library(googleway)
library('ReporteRs')
library(googledrive)
library(googlesheets)
library(mapsapi)
library(xml2)
library(leaflet)

capwords <- function(s, strict = FALSE) {
  cap <- function(s) paste(toupper(substring(s, 1, 1)),
                           {s <- substring(s, 2); if(strict) tolower(s) else s},
                           sep = "", collapse = " " )
  sapply(strsplit(s, split = " "), cap, USE.NAMES = !is.null(names(s)))
}
##############################
####  Parametros variables ###
##############################
setwd("C:/Users/gutie/Dropbox/Documentos Insumos")
#bufferDist<-c(198000)
#dir<-"G:/Propuestas"
dir0<-"PREWORK_CGF/FinalProject"
dir1<-"PREWORK_CGF/FinalProject/Rutas"
dir2<-"PREWORK_CGF/FinalProject/SHP"
gm_k="AIzaSyAZg2KKy9uBnepG4GRfSaVlnRkSkZLeiOA"
#gm_k="AIzaSyCH38XTzcU__J1CRnwsu4WXFXsRHF6QR0A" #gutierrez.crlos


#############
### Carga de informacionb?sica
#############

estados<-readOGR("Marco Geoestadistico/Estados", "ESTADOS", stringsAsFactors = FALSE, encoding = "LATIN1")
ageb_cdmx<-readOGR("Marco Geoestadistico/MGE_2018/MGE/09_ciudaddemexico/conjunto de datos", "09a", stringsAsFactors = FALSE, encoding = "LATIN1")
ageb_cdmx<-spTransform(ageb_cdmx, proj4string(estados))
ageb_edomx<-readOGR("Marco Geoestadistico/MGE_2018/MGE/15_mexico/conjunto de datos", "15a", stringsAsFactors = FALSE, encoding = "LATIN1")
ageb_edomx<-spTransform(ageb_edomx, proj4string(estados))
colonias<-readOGR("Marco Geoestadistico/Colonias", "Colonias", stringsAsFactors = FALSE, encoding = "LATIN1")
#colonias<-spTransform(colonias, proj4string(estados))
coordinates(colonias[as.numeric(colonias$POSTALCODE) %in% trabajadores$C..P.[1],])[2]

trabajadores<-read.csv(paste0(dir0, "/datos_vf.csv"), stringsAsFactors = F)
names(trabajadores)[1]<-"id_trabajador"
trabajadores$oid<-1:nrow(trabajadores)
trabajadores$lat<-NA
trabajadores$lon<-NA

###################
# Calculo de distancias
###################
trabajadores$Direccion<-iconv(trabajadores$Direccion, from="LATIN1", to="UTF-8")
trabajadores$Direccion2<-paste0("Calle ",trabajadores$Calle, " ", trabajadores$Numero, ", Col. ", trabajadores$Colonia,
                               ", ", trabajadores$Ciudad, ", c.p. ", trabajadores$C..P.)
trabajadores$Direccion3<-paste0("c.p. ", trabajadores$C..P.)


for(w in 1:nrow(trabajadores)){
  if(length(colonias[as.numeric(colonias$POSTALCODE) == trabajadores$C..P.[w],])!=0){
    trabajadores$lat[w]<-as.numeric(coordinates(gCentroid(colonias[as.numeric(colonias$POSTALCODE) == trabajadores$C..P.[w],]))[2])
    trabajadores$lon[w]<-as.numeric(coordinates(gCentroid(colonias[as.numeric(colonias$POSTALCODE) == trabajadores$C..P.[w],]))[1])
  }
}


for(ub in trabajadores$oid[is.na(trabajadores$lat)]){
  res<-google_geocode(trabajadores$Direccion2[ub], key = gm_k, simplify = TRUE)
  if(length(as.data.frame(res$results$geometry$location$lat[1]))!=0){
    trabajadores$lat[ub]<-as.data.frame(res$results$geometry$location$lat[1])
    trabajadores$lon[ub]<-as.data.frame(res$results$geometry$location$lng[1])
  }
} 
trabajadores$lat<-as.numeric(trabajadores$lat)
trabajadores$lon<-as.numeric(trabajadores$lon)

trabajadores<-trabajadores[!is.na(trabajadores$lat),]
coords.tmp<-cbind(trabajadores$lon, trabajadores$lat)
Tra<-trabajadores[,c('lon', 'lat')]
coordinates(Tra)<-~lon+lat
proj4string(Tra)<-CRS("+proj=longlat +ellps=WGS84")
Trabajadores<-SpatialPointsDataFrame(coords=Tra, data=data.frame(trabajadores), proj4string = CRS("+proj=longlat +ellps=WGS84"))
Trabajadores<-spTransform(Trabajadores, proj4string(estados))

writeOGR(Trabajadores, dir2, layer="Trabajadores" ,driver="ESRI Shapefile", overwrite_layer=T)


Departamentos<-trabajadores[,c("Departamento", "Dep_direccion")]
Departamentos<-unique(Departamentos)
Departamentos<-Departamentos[Departamentos$Dep_direccion!="",]
nrow(Departamentos)
Departamentos$lat<-NA
Departamentos$lon<-NA
for(ub in 1:nrow(Departamentos)){
  res<-google_geocode(Departamentos$Dep_direccion[ub], key = gm_k, simplify = TRUE)
  if(length(as.data.frame(res$results$geometry$location$lat[1]))!=0){
    Departamentos$lat[ub]<-as.data.frame(res$results$geometry$location$lat[1])
    Departamentos$lon[ub]<-as.data.frame(res$results$geometry$location$lng[1])
  }
} 
Departamentos$lat<-as.numeric(Departamentos$lat)
Departamentos$lon<-as.numeric(Departamentos$lon)

Departamentos<-Departamentos[!is.na(Departamentos$lat),]
coords.tmp<-cbind(Departamentos$lon, Departamentos$lat)
Dep<-Departamentos[,c('lon', 'lat')]
coordinates(Dep)<-~lon+lat
proj4string(Dep)<-CRS("+proj=longlat +ellps=WGS84")
DepartamentosGeo<-SpatialPointsDataFrame(coords=Dep, data=data.frame(Departamentos), proj4string = CRS("+proj=longlat +ellps=WGS84"))
DepartamentosGeo<-spTransform(DepartamentosGeo, proj4string(estados))

writeOGR(DepartamentosGeo, dir2, layer="Departamentos" ,driver="ESRI Shapefile", overwrite_layer=T)

names(DepartamentosGeo)<-c("Departamento",  "Dep_direccion", "lat_ct", "lon_ct")

TrabajadoresVF<-merge(data.frame(Trabajadores), data.frame(DepartamentosGeo), by.x="Departamento", by.y="Departamento", all.x=T)
TrabajadoresVF$TiempoViaje<-NA
TrabajadoresVF$Distancia<-NA

for(w in 1:nrow(TrabajadoresVF)){
  if(!is.na(TrabajadoresVF$lat.x[w]) &  !is.na(TrabajadoresVF$lat_ct[w])){
    res<-google_distance(origin=paste0(TrabajadoresVF$lat.x[w],",",TrabajadoresVF$lon.x[w]),
                         destination=paste0(TrabajadoresVF$lat_ct[w],",",TrabajadoresVF$lon_ct[w]),
                         mode="driving", units="metric", departure_time = "now",traffic_model = "optimistic", key=gm_k)
    TrabajadoresVF$TiempoViaje[w]<-res$rows$elements[[1]]$distance$value/1000
    TrabajadoresVF$Distancia[w]<-res$rows$elements[[1]]$duration$value/60
  }
}



TrabajadoresVF<-TrabajadoresVF[!is.na(TrabajadoresVF$lat.x),]
coords.tmp<-cbind(TrabajadoresVF$lon.x, TrabajadoresVF$lat.x)
Tra<-TrabajadoresVF[,c('lon.x', 'lat.x')]
coordinates(Tra)<-~lon.x+lat.x
proj4string(Tra)<-CRS("+proj=longlat +ellps=WGS84")
TrabajadoresVF2<-SpatialPointsDataFrame(coords=Tra, data=data.frame(TrabajadoresVF[,c("Departamento", "id_trabajador", "Nombre", "Fecha.nac", "Sexo", "Edo.Civi", "Dep_direccion.x", "Direccion", "Calle", "Numero", "Colonia", "Ciudad", "Estado", "C..P.", "Uso", "CFDI.Clave.Prod.serv", "Tipo.Contrato", "Tipo.Jorna", "Regimen.Fiscal", "Riesgo", "Puesto", "oid", "lat.x", "lon.x", "Direccion2", "lat_ct", "lon_ct", "TiempoViaje", "Distancia")]), proj4string = CRS("+proj=longlat +ellps=WGS84"))
TrabajadoresVF2<-spTransform(TrabajadoresVF2, proj4string(estados))

writeOGR(Trabajadores, dir2, layer="TrabajadoresVF2" ,driver="ESRI Shapefile", overwrite_layer=T)



plot(DepartamentosGeo[DepartamentosGeo$Departamento %in% TrabajadoresVF2$Departamento[TrabajadoresVF2$TiempoViaje>=120],], pch=16, col="red")
plot(estados, add=T)

Dist<-data.frame(origen=0:(nrow(TrabajadoresVF)-1))
for(d in 0:(nrow(TrabajadoresVF)-1)){
  Dist[[paste0("destino",d)]]<-1
}

Dist<-melt(Dist, i=colnames(Dist)[1])
Dist$variable<-destring(Dist$variable)
names(Dist)[2]<-"destino"
Dist<-Dist[Dist$origen!=Dist$destino,]
Dist$TiempoViaje<-NA
Dist$Distancia<-NA

for(w in 1:nrow(Dist)){
  res<-google_distance(origin=paste0(farms$lat[farms$oid==Dist$origen[w]],",",farms$lon[farms$oid==Dist$origen[w]]),
                       destination=paste0(farms$lat[farms$oid==Dist$destino[w]],",",farms$lon[farms$oid==Dist$destino[w]]),
                       mode="driving", units="metric", departure_time = "now",traffic_model = "optimistic", key=gm_k)
  Dist$TiempoViaje[w]<-res$rows$elements[[1]]$distance$value/1000
  Dist$Distancia[w]<-res$rows$elements[[1]]$duration$value/60
} 


w=0
old=c()
for(r in 1:(nrow(farms)-1)){
  
  old<-c(old, w)
  oidOrigen=w
  oidDestino=Dist$destino[Dist$origen==w & Dist$TiempoViaje==min(Dist$TiempoViaje[!(Dist$destino %in% old) & Dist$origen==w])]
  Origen=paste0(farms$Empresa[farms$oid==oidOrigen], ", Address: ", farms$Addres[farms$oid==oidOrigen] )
  Destino=paste0(farms$Empresa[farms$oid==oidDestino], ", Address: ", farms$Addres[farms$oid==oidDestino] )
  TrabajadoresDestino=farms$nWorkers[farms$oid==oidDestino]
  TiempoViaje=Dist$TiempoViaje[Dist$origen==w & Dist$TiempoViaje==min(Dist$TiempoViaje[!(Dist$destino %in% old) & Dist$origen==w])]
  Distancia=Dist$Distancia[Dist$origen==w & Dist$TiempoViaje==min(Dist$TiempoViaje[!(Dist$destino %in% old) & Dist$origen==w])]
  TimpoWorkers=farms$tiempo[farms$oid==oidDestino]
  TiempoTotal=TiempoViaje+TimpoWorkers+30
  if(w==0){
    Ruta<-data.frame(oidOrigen=oidOrigen,Origen=Origen,oidDestino=oidDestino,Destino=Destino,
                     TrabajadoresDestino=TrabajadoresDestino,Distancia=Distancia,TiempoViaje=TiempoViaje,
                     TimpoWorkers=TimpoWorkers,TiempoTotal=TiempoTotal)}
  else{
      Ruta<-rbind(Ruta, data.frame(oidOrigen=oidOrigen,Origen=Origen,oidDestino=oidDestino,Destino=Destino,
                                   TrabajadoresDestino=TrabajadoresDestino, Distancia=Distancia,TiempoViaje=TiempoViaje,
                                   TimpoWorkers=TimpoWorkers,TiempoTotal=TiempoTotal))
  }
  w=oidDestino
}
Ruta$TiempoAcumulado<-NA
for(z in 1:nrow(Ruta)){
  if(z==1){Ruta$TiempoAcumulado[z]<-Ruta$TiempoTotal[z]}
  else{Ruta$TiempoAcumulado[z]<-Ruta$TiempoTotal[z]+Ruta$TiempoAcumulado[z-1]}
}
Ruta$DiasTrabajo<-ceiling(Ruta$TiempoAcumulado/60/8)
write.csv(Ruta, paste0(dir1,"/RutaOptima.csv"), fileEncoding = "UTF-8")

MatrizTiempo<-dcast(Dist,origen+value~destino, value.var="TiempoViaje")
write.csv(MatrizTiempo, paste0(dir1,"/MatrizTiempo.csv"), fileEncoding = "UTF-8")

routs<-c()
for(r in 1:nrow(Ruta)){
  res<-google_directions(origin=paste0(farms$lat[farms$oid==Ruta$oidOrigen[r]],",",farms$lon[farms$oid==Ruta$oidOrigen[r]]),
                         destination=paste0(farms$lat[farms$oid==Ruta$oidDestino[r]],",",farms$lon[farms$oid==Ruta$oidDestino[r]]),
                         mode="driving", units="metric", departure_time = "now",traffic_model = "optimistic", key=gm_k)
  routs<-c(routs,access_result(res, "polyline"))
}
farms$etiqueta<-paste0(farms$Empresa,"\n Address:", farms$Addres, "\n no. Workers", farms$nWorkers )
map <- leaflet(data=Trabajadores) %>% 
  addProviderTiles(providers$OpenStreetMap.Mapnik) %>%
  addMarkers(~lon, ~lat,  popup = ~as.character(etiqueta), label = ~as.character(etiqueta))


for(r in 1:(nrow(Ruta))){
  doc = mp_directions(
    origin=c(as.numeric(farms$lon[farms$oid==Ruta$oidOrigen[r]]),as.numeric(farms$lat[farms$oid==Ruta$oidOrigen[r]])),
    destination=c(as.numeric(farms$lon[farms$oid==Ruta$oidDestino[r]]),as.numeric(farms$lat[farms$oid==Ruta$oidDestino[r]])),
    alternatives = FALSE,
    key=gm_k
    )
  rt<-mp_get_routes(doc)
  pal = colorFactor(palette = "YlOrRd", domain = 1:(nrow(Ruta)))
  map<-map %>%
    addPolylines(data =rt , opacity = 1, weight = 7, color = ~pal(r))
}

  