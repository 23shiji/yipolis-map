all:
	for i in *.svg; \
		do \
			echo "$$i"; \
			xmllint --compress --noblanks -o "min/$$i" "$$i"; \
	done; 