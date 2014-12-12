MYSCRIPT_RESULT=$(ip addr show eth0 | awk '/ inet / {split($2,arr,"/");print arr[1]}')
echo host ip $MYSCRIPT_RESULT in apache and geoserver available as /vm/
sudo docker exec geoserver bash ./write.sh $MYSCRIPT_RESULT
sudo docker exec apache bash ./write.sh $MYSCRIPT_RESULT
