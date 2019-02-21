#pragma once

class SpyceException {
    std::string str;
public:
    SpyceException(const std::string& str) : str(str) {}
    SpyceException(const char *str) : str(std::string(str)) {}
    const std::string& what() const {return str;};
};

struct FileNotFoundException : public SpyceException {
    explicit FileNotFoundException() : SpyceException("File Not Found") {}
};