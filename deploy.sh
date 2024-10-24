
SSH_USER="root"
SSH_HOST="104.156.232.16"

echo "Deleting node modules"
sudo rm -r node_modules 
sudo rm -rf package-lock.json

echo "Deploying files to server..."
scp -r ./* root@104.156.232.16:/var/www/html/NextUp/

echo "Logging in server"
ssh -t $SSH_USER@$SSH_HOST <<EOF
cd /var/www/html/NextUp
pm2 restart NextupApi
EOF
    
read -p "Press Enter to exit..."