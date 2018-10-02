#!/bin/sh
A=$(sshpass -p alef@123 ssh alef@10.14.32.23 "./latest_folder.sh")

B=$(sshpass -p alef@123 ssh alef@10.14.32.23 "./second_file.sh")]

D="/"
E=".outp"
scp alef@10.14.32.23:/home/alef/cdrs/acked/$A$D$B .

echo $B
if [ -f $B ]; then
cdrconvert -asn /opt/marben/ASN_1_CGF_Decoder_Dictionary.asn -msg GPRSRecord -i $B -o cdr_output.xml
python /opt/marben/cdrparse1.py cdr_output.xml $1
else
echo "wrong file"
fi
