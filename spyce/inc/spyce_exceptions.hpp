#pragma once

#define build_exception_msg(NAME, MSG) struct NAME ## Exception : public SpyceException { \
    explicit NAME ## Exception() : SpyceException(MSG) {}}

#define build_exception(NAME) struct NAME ## Exception : public SpyceException { \
    explicit NAME ## Exception(std::string err) : SpyceException(err) {}}

class SpyceException {
    std::string str;
public:
    SpyceException(const std::string& str) : str(str) {}
    SpyceException(const char *str) : str(std::string(str)) {}
    const std::string& what() const {return str;};
};

build_exception_msg(FileNotFound, "File Not Found");
build_exception(InvalidFile);
build_exception(InvalidArgument);
build_exception(Internal);
build_exception_msg(IDNotFound, "ID Not Found");
build_exception_msg(InsufficientData, "Insufficient Data");
