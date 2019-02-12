#pragma once

#include <stdexcept>

struct FileNotFoundException : public std::runtime_error {
    explicit FileNotFoundException() : std::runtime_error("File Not Found") {}
};