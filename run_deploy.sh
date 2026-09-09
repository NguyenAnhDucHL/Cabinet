#!/bin/bash
export SSHPASS='sMOh_1{k~*AczwlP$'
export SCP_CMD="sshpass -e scp -o StrictHostKeyChecking=no -o LogLevel=ERROR"
export SSH_CMD="sshpass -e ssh -o StrictHostKeyChecking=no -o LogLevel=ERROR"
export VNPT_USER=root
export VNPT_HOST=14.225.172.225

echo -e "\n--- COPY ĐÚNG CERT MỚI ---"
$SCP_CMD /Users/macbookpro/Cabinet/nginx/certs/fullchain_correct.pem $VNPT_USER@$VNPT_HOST:/root/vp-gateway/nginx/certs/STAR_vpdtcampha_vn_cert_inter_root.crt

echo -e "\n--- RELOAD NGINX-PROXY ---"
$SSH_CMD $VNPT_USER@$VNPT_HOST "docker exec nginx-proxy nginx -s reload"
