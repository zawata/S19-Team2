#pragma once

#include "SpiceUsr.h"

struct Frame {
    double x,y,z,dx,dy,dz;

    Frame(SpiceDouble *frame);
    Frame();
};


struct spyce {
    std::string file;

    spyce();

    //get and set for file.
    void _set_file(std::string s);
    std::string _get_file();

    void add_kernel(std::string s);
    void remove_kernel(std::string s);
};