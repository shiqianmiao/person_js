all: swf

swf: build.xml ImageCroper.as ImageFile.as
	mxmlc ImageCroper.as -load-config+=build.xml -o ../swf/ImageCroper.swf
	mxmlc ImageCroper.as -load-config+=build.xml -o ../../../../build/swf/ImageCroper.swf
.PHONY: clean

clean:
	rm ../swf/ImageCroper.swf